package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.User;
import com.example.zhitongxiaoyuan.mapper.UserMapper;
import com.example.zhitongxiaoyuan.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User getUserByOpenid(String openid) {
        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("openid", openid);
        return getOne(wrapper);
    }

    @Override
    @Transactional
    public User createOrUpdateUser(String openid, String nickname, String avatar) {
        User user = getUserByOpenid(openid);

        if (user == null) {
            // 创建新用户
            user = new User();
            user.setOpenid(openid);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            user.setPointsBalance(0);
            save(user);
        } else {
            // 更新用户信息
            user.setNickname(nickname);
            user.setAvatar(avatar);
            updateById(user);
        }

        return user;
    }

    @Override
    public User updateUserInfo(User user) {
        updateById(user);
        return user;
    }

    @Override
    @Transactional
    public boolean addPoints(Long userId, Integer points) {
        User user = getById(userId);
        if (user == null) {
            return false;
        }

        Integer currentBalance = user.getPointsBalance() != null ? user.getPointsBalance() : 0;
        user.setPointsBalance(currentBalance + points);
        return updateById(user);
    }

    @Override
    @Transactional
    public boolean deductPoints(Long userId, Integer points) {
        User user = getById(userId);
        if (user == null) {
            return false;
        }

        Integer currentBalance = user.getPointsBalance() != null ? user.getPointsBalance() : 0;
        if (currentBalance < points) {
            throw new RuntimeException("积分余额不足");
        }

        user.setPointsBalance(currentBalance - points);
        return updateById(user);
    }

    @Override
    public Integer getPointsBalance(Long userId) {
        User user = getById(userId);
        if (user == null) {
            return 0;
        }
        return user.getPointsBalance() != null ? user.getPointsBalance() : 0;
    }
}
