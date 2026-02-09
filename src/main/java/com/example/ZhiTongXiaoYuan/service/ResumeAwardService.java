package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.ResumeAward;

import java.util.List;

/**
 * 获奖经历服务接口
 */
public interface ResumeAwardService extends IService<ResumeAward> {

    /**
     * 根据简历ID获取获奖经历列表
     */
    List<ResumeAward> getByResumeId(Long resumeId);

    /**
     * 创建获奖经历
     */
    ResumeAward createAward(ResumeAward award);

    /**
     * 更新获奖经历
     */
    ResumeAward updateAward(ResumeAward award);

    /**
     * 删除获奖经历
     */
    boolean deleteAward(Long id);
}
