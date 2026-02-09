package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

/**
 * 收藏实体类
 */
@Data
@TableName("favorite")
public class Favorite {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long jobId;

    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @TableLogic
    private Integer deleted;
}
