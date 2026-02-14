package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.util.Date;

/**
 * 职位实体类
 */
@Data
@TableName("job")
public class Job {

    /**
     * 职位ID（自增）
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 公司ID（关联 company 表）
     */
    private Long companyId;

    /**
     * 职位名称
     */
    private String title;

    /**
     * 最低薪资（单位：k）
     */
    private Integer salaryMin;

    /**
     * 最高薪资（单位：k）
     */
    private Integer salaryMax;

    /**
     * 学历要求
     */
    private String education;

    /**
     * 经验要求
     */
    private String experience;

    /**
     * 技能标签（JSON数组字符串）
     * 注意：存储格式为 JSON 字符串，如：["Java","Spring Boot"]
     * 前端需要自行解析为数组
     */
    private String tags;

    /**
     * 工作城市
     */
    private String city;

    /**
     * 职位描述
     */
    private String description;

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
