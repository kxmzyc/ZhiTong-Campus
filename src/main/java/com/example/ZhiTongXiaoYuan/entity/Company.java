package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.util.Date;

/**
 * 公司实体类
 */
@Data
@TableName("company")
public class Company {

    /**
     * 公司ID（手动指定，与前端路由匹配）
     */
    @TableId(type = IdType.INPUT)
    private Long id;

    /**
     * 公司名称
     */
    private String name;

    /**
     * Logo URL
     */
    private String logo;

    /**
     * 标签（JSON数组字符串）
     * 注意：存储格式为 JSON 字符串，如：["互联网","电商","云计算"]
     * 前端需要自行解析为数组，或者在 Service 层处理
     */
    private String tags;

    /**
     * 行业
     */
    private String industry;

    /**
     * 城市/地点
     */
    private String location;

    /**
     * 公司简介
     */
    private String description;

    /**
     * 在招职位数
     */
    private Integer jobCount;

    /**
     * 公司规模（如：10000人以上）
     */
    private String scale;

    /**
     * 融资状态（如：已上市）
     */
    private String financingStatus;

    /**
     * 公司详细介绍（用于详情页）
     */
    private String introduction;

    /**
     * 工商信息（JSON字符串）
     * 注意：存储格式为 JSON 字符串，前端需要自行解析
     */
    private String businessInfo;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    /**
     * 逻辑删除标记（0-未删除，1-已删除）
     */
    @TableLogic
    @JsonIgnore
    private Integer deleted;
}
