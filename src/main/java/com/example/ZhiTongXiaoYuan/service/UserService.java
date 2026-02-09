package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.User;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {

    /**
     * 根据 openid 获取用户
     */
    User getUserByOpenid(String openid);

    /**
     * 创建或更新用户（微信登录）
     */
    User createOrUpdateUser(String openid, String nickname, String avatar);

    /**
     * 更新用户信息
     */
    User updateUserInfo(User user);

    /**
     * 增加积分
     */
    boolean addPoints(Long userId, Integer points);

    /**
     * 扣减积分
     */
    boolean deductPoints(Long userId, Integer points);

    /**
     * 获取用户积分余额
     */
    Integer getPointsBalance(Long userId);
}
