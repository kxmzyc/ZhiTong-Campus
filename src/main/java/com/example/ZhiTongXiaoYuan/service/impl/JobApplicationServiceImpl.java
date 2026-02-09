package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.JobApplication;
import com.example.zhitongxiaoyuan.mapper.JobApplicationMapper;
import com.example.zhitongxiaoyuan.service.JobApplicationService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 职位申请服务实现类
 */
@Service
public class JobApplicationServiceImpl extends ServiceImpl<JobApplicationMapper, JobApplication> implements JobApplicationService {

    @Override
    public JobApplication applyJob(Long userId, Long jobId, Long resumeId) {
        // 检查是否已申请
        if (hasApplied(userId, jobId)) {
            throw new RuntimeException("已申请过该职位");
        }

        JobApplication application = new JobApplication();
        application.setUserId(userId);
        application.setJobId(jobId);
        application.setResumeId(resumeId);
        application.setStatus("pending");

        save(application);
        return application;
    }

    @Override
    public List<JobApplication> getApplicationsByUserId(Long userId) {
        QueryWrapper<JobApplication> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.orderByDesc("applied_at");
        return list(wrapper);
    }

    @Override
    public List<JobApplication> getApplicationsByUserIdAndStatus(Long userId, String status) {
        QueryWrapper<JobApplication> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("status", status);
        wrapper.orderByDesc("applied_at");
        return list(wrapper);
    }

    @Override
    public boolean cancelApplication(Long id, Long userId) {
        // 验证申请是否属于该用户
        JobApplication application = getById(id);
        if (application == null) {
            return false;
        }
        if (!application.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作该申请");
        }

        return removeById(id);
    }

    @Override
    public boolean hasApplied(Long userId, Long jobId) {
        QueryWrapper<JobApplication> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("job_id", jobId);
        return count(wrapper) > 0;
    }

    @Override
    public JobApplication getApplicationDetail(Long id) {
        return getById(id);
    }
}
