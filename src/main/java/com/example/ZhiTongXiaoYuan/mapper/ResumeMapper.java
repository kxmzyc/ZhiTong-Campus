package com.example.zhitongxiaoyuan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.zhitongxiaoyuan.entity.Resume;
import org.apache.ibatis.annotations.Mapper;

/**
 * 简历 Mapper 接口
 */
@Mapper
public interface ResumeMapper extends BaseMapper<Resume> {
}
