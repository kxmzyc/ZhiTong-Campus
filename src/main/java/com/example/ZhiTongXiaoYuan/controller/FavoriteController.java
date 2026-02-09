package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.Favorite;
import com.example.zhitongxiaoyuan.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 收藏控制器
 */
@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    /**
     * 添加收藏
     */
    @PostMapping("/add")
    public Result<Favorite> addFavorite(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long jobId = Long.valueOf(params.get("jobId").toString());

        try {
            Favorite favorite = favoriteService.addFavorite(userId, jobId);
            return Result.success("收藏成功", favorite);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 取消收藏
     */
    @DeleteMapping("/remove")
    public Result<Void> removeFavorite(@RequestParam Long userId, @RequestParam Long jobId) {
        boolean success = favoriteService.removeFavorite(userId, jobId);
        if (success) {
            return Result.success("取消收藏成功", null);
        } else {
            return Result.error("取消收藏失败");
        }
    }

    /**
     * 获取收藏列表
     */
    @GetMapping("/list/{userId}")
    public Result<List<Favorite>> getFavoritesByUserId(@PathVariable Long userId) {
        List<Favorite> favorites = favoriteService.getFavoritesByUserId(userId);
        return Result.success(favorites);
    }

    /**
     * 检查是否已收藏
     */
    @GetMapping("/check")
    public Result<Map<String, Boolean>> checkFavorited(@RequestParam Long userId, @RequestParam Long jobId) {
        boolean isFavorited = favoriteService.isFavorited(userId, jobId);
        Map<String, Boolean> result = new HashMap<>();
        result.put("isFavorited", isFavorited);
        return Result.success(result);
    }

    /**
     * 切换收藏状态
     */
    @PostMapping("/toggle")
    public Result<Map<String, Boolean>> toggleFavorite(@RequestBody Map<String, Object> params) {
        Long userId = Long.valueOf(params.get("userId").toString());
        Long jobId = Long.valueOf(params.get("jobId").toString());

        try {
            boolean isFavorited = favoriteService.toggleFavorite(userId, jobId);
            Map<String, Boolean> result = new HashMap<>();
            result.put("isFavorited", isFavorited);

            String message = isFavorited ? "收藏成功" : "取消收藏成功";
            return Result.success(message, result);
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }
}
