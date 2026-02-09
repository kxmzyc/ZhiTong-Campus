package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.Favorite;
import com.example.zhitongxiaoyuan.mapper.FavoriteMapper;
import com.example.zhitongxiaoyuan.service.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 收藏服务实现类
 */
@Service
public class FavoriteServiceImpl extends ServiceImpl<FavoriteMapper, Favorite> implements FavoriteService {

    @Override
    public Favorite addFavorite(Long userId, Long jobId) {
        // 检查是否已收藏
        if (isFavorited(userId, jobId)) {
            throw new RuntimeException("已收藏过该职位");
        }

        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setJobId(jobId);

        save(favorite);
        return favorite;
    }

    @Override
    public boolean removeFavorite(Long userId, Long jobId) {
        QueryWrapper<Favorite> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("job_id", jobId);

        return remove(wrapper);
    }

    @Override
    public List<Favorite> getFavoritesByUserId(Long userId) {
        QueryWrapper<Favorite> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.orderByDesc("created_at");
        return list(wrapper);
    }

    @Override
    public boolean isFavorited(Long userId, Long jobId) {
        QueryWrapper<Favorite> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("job_id", jobId);
        return count(wrapper) > 0;
    }

    @Override
    public boolean toggleFavorite(Long userId, Long jobId) {
        if (isFavorited(userId, jobId)) {
            // 已收藏，则取消收藏
            return removeFavorite(userId, jobId);
        } else {
            // 未收藏，则添加收藏
            addFavorite(userId, jobId);
            return true;
        }
    }
}
