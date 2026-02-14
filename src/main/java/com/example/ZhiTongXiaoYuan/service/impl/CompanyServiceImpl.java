package com.example.zhitongxiaoyuan.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.zhitongxiaoyuan.entity.Company;
import com.example.zhitongxiaoyuan.mapper.CompanyMapper;
import com.example.zhitongxiaoyuan.service.CompanyService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 公司服务实现类
 */
@Service
public class CompanyServiceImpl extends ServiceImpl<CompanyMapper, Company> implements CompanyService {

    /**
     * 获取所有公司列表
     * @return 公司列表
     */
    @Override
    public List<Company> getAllCompanies() {
        LambdaQueryWrapper<Company> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.orderByDesc(Company::getJobCount); // 按职位数量降序排列
        return this.list(queryWrapper);
    }

    /**
     * 根据ID获取公司详情
     * @param id 公司ID
     * @return 公司详情
     */
    @Override
    public Company getCompanyById(Long id) {
        return this.getById(id);
    }

    /**
     * 根据条件搜索公司
     * @param keyword 关键词（公司名称）
     * @param industry 行业
     * @param location 城市
     * @return 公司列表
     */
    @Override
    public List<Company> searchCompanies(String keyword, String industry, String location) {
        LambdaQueryWrapper<Company> queryWrapper = new LambdaQueryWrapper<>();

        // 关键词搜索（公司名称或描述）
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(wrapper -> wrapper
                    .like(Company::getName, keyword)
                    .or()
                    .like(Company::getDescription, keyword)
            );
        }

        // 行业筛选
        if (StringUtils.hasText(industry)) {
            queryWrapper.eq(Company::getIndustry, industry);
        }

        // 城市筛选
        if (StringUtils.hasText(location)) {
            queryWrapper.eq(Company::getLocation, location);
        }

        // 按职位数量降序排列
        queryWrapper.orderByDesc(Company::getJobCount);

        return this.list(queryWrapper);
    }
}
