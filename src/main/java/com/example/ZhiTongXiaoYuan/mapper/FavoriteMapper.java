package com.example.zhitongxiaoyuan.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.zhitongxiaoyuan.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;

/**
 * 收藏 Mapper 接口
 */
@Mapper
public interface FavoriteMapper extends BaseMapper<Favorite> {
}
