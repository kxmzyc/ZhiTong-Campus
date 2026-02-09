package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

/**
 * 职位实体类
 */
@Data
@TableName("job")
public class Job {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String company;

    private String city;

    private String salaryRange;

    private String educationRequired;

    private String experienceRequired;

    private String jobType;

    private String industry;

    private String description;

    private String requirements;

    private String benefits;

    private String status;

    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    @TableLogic
    private Integer deleted;
}
