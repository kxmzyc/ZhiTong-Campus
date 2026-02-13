package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.Job;
import com.example.zhitongxiaoyuan.mapper.JobMapper;
import com.example.zhitongxiaoyuan.service.JobService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 职位服务实现类
 */
@Service
public class JobServiceImpl extends ServiceImpl<JobMapper, Job> implements JobService {

    @Override
    public List<Job> searchJobs(String keyword, String city, String industry, String jobType) {
        QueryWrapper<Job> wrapper = new QueryWrapper<>();

        // 只查询状态为 active 的职位
        wrapper.eq("status", "active");

        // 关键词搜索：标题或公司名包含关键词
        if (StringUtils.isNotBlank(keyword)) {
            wrapper.and(w -> w.like("title", keyword).or().like("company", keyword));
        }

        // 城市筛选（过滤掉"全部"、"全国"等特殊值）
        if (StringUtils.isNotBlank(city) &&
            !city.equals("全部") &&
            !city.equals("全国") &&
            !city.equals("不限")) {
            wrapper.eq("city", city);
        }

        // 行业筛选（过滤掉"全部"、"不限"等特殊值）
        if (StringUtils.isNotBlank(industry) &&
            !industry.equals("全部") &&
            !industry.equals("不限")) {
            wrapper.eq("industry", industry);
        }

        // 职位类型筛选（过滤掉"全部"等特殊值）
        if (StringUtils.isNotBlank(jobType) &&
            !jobType.equals("全部") &&
            !jobType.equals("不限")) {
            wrapper.eq("job_type", jobType);
        }

        // 按更新时间倒序排序
        wrapper.orderByDesc("updated_at");

        return list(wrapper);
    }
}
