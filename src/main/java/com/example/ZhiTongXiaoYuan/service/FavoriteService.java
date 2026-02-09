package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.Favorite;

import java.util.List;

/**
 * 收藏服务接口
 */
public interface FavoriteService extends IService<Favorite> {

    /**
     * 添加收藏
     */
    Favorite addFavorite(Long userId, Long jobId);

    /**
     * 取消收藏
     */
    boolean removeFavorite(Long userId, Long jobId);

    /**
     * 获取用户的收藏列表
     */
    List<Favorite> getFavoritesByUserId(Long userId);

    /**
     * 检查是否已收藏
     */
    boolean isFavorited(Long userId, Long jobId);

    /**
     * 切换收藏状态（已收藏则取消，未收藏则添加）
     */
    boolean toggleFavorite(Long userId, Long jobId);
}
