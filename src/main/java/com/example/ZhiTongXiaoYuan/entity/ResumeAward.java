package com.example.zhitongxiaoyuan.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.util.Date;

/**
 * 获奖经历实体类
 */
@Data
@TableName("resume_award")
public class ResumeAward {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long resumeId;

    private String name;

    private String level;

    private Date awardDate;

    private String description;

    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updatedAt;

    @TableLogic
    private Integer deleted;
}
