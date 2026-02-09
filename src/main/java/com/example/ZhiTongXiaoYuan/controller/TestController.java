package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试控制器
 */
@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/hello")
    public Result<String> hello() {
        return Result.success("Hello from Spring Boot!", "智通校园后端服务运行正常");
    }
}
