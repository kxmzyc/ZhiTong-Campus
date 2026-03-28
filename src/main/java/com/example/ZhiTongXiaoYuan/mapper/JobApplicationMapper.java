package com.example.zhitongxiaoyuan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.zhitongxiaoyuan.entity.JobApplication;
import com.example.zhitongxiaoyuan.vo.JobApplicationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 职位申请 Mapper 接口
 */
@Mapper
public interface JobApplicationMapper extends BaseMapper<JobApplication> {

    /**
     * 查询用户的申请列表（包含职位和公司信息）
     * @param userId 用户ID
     * @return 申请列表
     */
    List<JobApplicationVO> selectApplicationListWithDetails(@Param("userId") Long userId);
}
