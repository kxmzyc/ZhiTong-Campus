package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

/**
 * 教育经历实体类
 */
@Data
@TableName("resume_education")
public class ResumeEducation {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long resumeId;

    private String school;

    private String major;

    private String education;

    private Date startDate;

    private Date endDate;

    private String description;

    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    @TableLogic
    private Integer deleted;
}
