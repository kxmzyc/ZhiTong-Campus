package com.example.zhitongxiaoyuan.vo;

import lombok.Data;
import java.util.Date;

/**
 * 职位申请视图对象
 * 用于返回申请列表时的详细信息（包含职位和公司信息）
 */
@Data
public class JobApplicationVO {

    /**
     * 申请ID
     */
    private Long id;

    /**
     * 职位ID
     */
    private Long jobId;

    /**
     * 职位名称
     */
    private String jobTitle;

    /**
     * 最低薪资（单位：k）
     */
    private Integer salaryMin;

    /**
     * 最高薪资（单位：k）
     */
    private Integer salaryMax;

    /**
     * 公司名称
     */
    private String companyName;

    /**
     * 公司Logo
     */
    private String companyLogo;

    /**
     * 申请状态
     */
    private String status;

    /**
     * 申请时间
     */
    private Date appliedAt;

    /**
     * 工作城市
     */
    private String city;

    /**
     * 公司ID
     */
    private Long companyId;
}
