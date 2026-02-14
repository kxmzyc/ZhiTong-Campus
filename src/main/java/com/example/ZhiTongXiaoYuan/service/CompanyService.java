package com.example.zhitongxiaoyuan.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.zhitongxiaoyuan.entity.Company;

import java.util.List;

/**
 * 公司服务接口
 */
public interface CompanyService extends IService<Company> {

    /**
     * 获取所有公司列表
     * @return 公司列表
     */
    List<Company> getAllCompanies();

    /**
     * 根据ID获取公司详情
     * @param id 公司ID
     * @return 公司详情
     */
    Company getCompanyById(Long id);

    /**
     * 根据条件搜索公司
     * @param keyword 关键词（公司名称）
     * @param industry 行业
     * @param location 城市
     * @return 公司列表
     */
    List<Company> searchCompanies(String keyword, String industry, String location);
}
