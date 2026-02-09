package com.example.zhitongxiaoyuan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.zhitongxiaoyuan.entity.JobApplication;
import org.apache.ibatis.annotations.Mapper;

/**
 * 职位申请 Mapper 接口
 */
@Mapper
public interface JobApplicationMapper extends BaseMapper<JobApplication> {
}
