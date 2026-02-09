package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.JobApplication;

import java.util.List;

/**
 * 职位申请服务接口
 */
public interface JobApplicationService extends IService<JobApplication> {

    /**
     * 申请职位
     */
    JobApplication applyJob(Long userId, Long jobId, Long resumeId);

    /**
     * 根据用户ID获取申请列表
     */
    List<JobApplication> getApplicationsByUserId(Long userId);

    /**
     * 根据用户ID和状态获取申请列表
     */
    List<JobApplication> getApplicationsByUserIdAndStatus(Long userId, String status);

    /**
     * 撤销申请
     */
    boolean cancelApplication(Long id, Long userId);

    /**
     * 检查是否已申请
     */
    boolean hasApplied(Long userId, Long jobId);

    /**
     * 获取申请详情（包含职位信息）
     */
    JobApplication getApplicationDetail(Long id);
}
