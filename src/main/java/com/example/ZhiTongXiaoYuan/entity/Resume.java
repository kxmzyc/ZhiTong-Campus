package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

/**
 * 简历实体类
 */
@Data
@TableName("resume")
public class Resume {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String name;

    private String gender;

    private Date birthDate;

    private String phone;

    private String email;

    private String education;

    private String school;

    private String major;

    private Date graduationDate;

    private String jobIntention;

    private String expectedCity;

    private String expectedSalary;

    private String selfEvaluation;

    private String skills;

    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    @TableLogic
    private Integer deleted;
}
