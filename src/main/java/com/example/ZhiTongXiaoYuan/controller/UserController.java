package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.User;
import com.example.zhitongxiaoyuan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 根据ID获取用户信息
     */
    @GetMapping("/{id}")
    public Result<User> getUserById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }

    /**
     * 根据 openid 获取用户信息
     */
    @GetMapping("/openid/{openid}")
    public Result<User> getUserByOpenid(@PathVariable String openid) {
        User user = userService.getUserByOpenid(openid);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }

    /**
     * 创建或更新用户（微信登录）
     */
    @PostMapping("/login")
    public Result<User> login(@RequestBody Map<String, String> params) {
        String openid = params.get("openid");
        String nickname = params.get("nickname");
        String avatar = params.get("avatar");

        if (openid == null || openid.isEmpty()) {
            return Result.error("openid 不能为空");
        }

        User user = userService.createOrUpdateUser(openid, nickname, avatar);
        return Result.success("登录成功", user);
    }

    /**
     * 更新用户信息
     */
    @PutMapping
    public Result<User> updateUser(@RequestBody User user) {
        if (user.getId() == null) {
            return Result.error("用户ID不能为空");
        }

        User updated = userService.updateUserInfo(user);
        return Result.success("更新成功", updated);
    }

    /**
     * 获取用户积分余额
     */
    @GetMapping("/points/{userId}")
    public Result<Map<String, Integer>> getPointsBalance(@PathVariable Long userId) {
        Integer balance = userService.getPointsBalance(userId);
        Map<String, Integer> result = new HashMap<>();
        result.put("balance", balance);
        return Result.success(result);
    }

    /**
     * 增加积分
     */
    @PostMapping("/points/add")
    public Result<Void> addPoints(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Integer points = Integer.valueOf(params.get("points").toString());

        boolean success = userService.addPoints(userId, points);
        if (success) {
            return Result.success("积分增加成功", null);
        } else {
            return Result.error("积分增加失败");
        }
    }

    /**
     * 扣减积分
     */
    @PostMapping("/points/deduct")
    public Result<Void> deductPoints(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Integer points = Integer.valueOf(params.get("points").toString());

        try {
            boolean success = userService.deductPoints(userId, points);
            if (success) {
                return Result.success("积分扣减成功", null);
            } else {
                return Result.error("积分扣减失败");
            }
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
