package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.User;
import com.example.zhitongxiaoyuan.service.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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

    @Value("${wechat.appid}")
    private String appid;

    @Value("${wechat.secret}")
    private String secret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

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
     * 微信小程序登录（使用 code 换取 openid）
     */
    @PostMapping("/login")
    public Result<User> login(@RequestBody Map<String, String> params) {
        String code = params.get("code");
        String nickname = params.get("nickname");
        String avatar = params.get("avatar");

        // 验证 code
        if (code == null || code.isEmpty()) {
            return Result.error("code 不能为空");
        }

        try {
            // 调用微信接口获取 openid
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appid, secret, code
            );

            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            // 检查是否有错误
            if (jsonNode.has("errcode")) {
                int errcode = jsonNode.get("errcode").asInt();
                if (errcode != 0) {
                    String errmsg = jsonNode.has("errmsg") ? jsonNode.get("errmsg").asText() : "未知错误";
                    return Result.error("微信登录失败: " + errmsg);
                }
            }

            // 获取 openid
            if (!jsonNode.has("openid")) {
                return Result.error("获取 openid 失败");
            }

            String openid = jsonNode.get("openid").asText();

            // 创建或更新用户
            User user = userService.createOrUpdateUser(openid, nickname, avatar);
            return Result.success("登录成功", user);

        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("登录失败: " + e.getMessage());
        }
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
