package com.example.zhitongxiaoyuan.controller;

import com.example.zhitongxiaoyuan.common.Result;
import com.example.zhitongxiaoyuan.entity.Company;
import com.example.zhitongxiaoyuan.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 公司控制器
 */
@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    /**
     * 获取所有公司列表（用于校招页）
     * 支持可选的搜索条件
     *
     * @param keyword 关键词（可选）
     * @param industry 行业（可选）
     * @param location 城市（可选）
     * @return 公司列表
     */
    @GetMapping("/list")
    public Result<List<Company>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String location) {

        List<Company> companies;

        // 如果有搜索条件，使用搜索方法
        if (keyword != null || industry != null || location != null) {
            companies = companyService.searchCompanies(keyword, industry, location);
        } else {
            // 否则返回所有公司
            companies = companyService.getAllCompanies();
        }

        return Result.success(companies);
    }

    /**
     * 根据ID获取公司详情（用于详情页）
     *
     * @param id 公司ID
     * @return 公司详情
     */
    @GetMapping("/detail/{id}")
    public Result<Company> getDetail(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);

        if (company == null) {
            return Result.error("公司不存在");
        }

        return Result.success(company);
    }

    /**
     * 创建公司（管理员功能）
     *
     * @param company 公司信息
     * @return 创建结果
     */
    @PostMapping("/create")
    public Result<Company> create(@RequestBody Company company) {
        boolean success = companyService.save(company);

        if (success) {
            return Result.success("创建成功", company);
        } else {
            return Result.error("创建失败");
        }
    }

    /**
     * 更新公司信息（管理员功能）
     *
     * @param id 公司ID
     * @param company 公司信息
     * @return 更新结果
     */
    @PutMapping("/update/{id}")
    public Result<Company> update(@PathVariable Long id, @RequestBody Company company) {
        company.setId(id);
        boolean success = companyService.updateById(company);

        if (success) {
            return Result.success("更新成功", company);
        } else {
            return Result.error("更新失败");
        }
    }

    /**
     * 删除公司（管理员功能，逻辑删除）
     *
     * @param id 公司ID
     * @return 删除结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        boolean success = companyService.removeById(id);

        if (success) {
            return Result.success("删除成功", null);
        } else {
            return Result.error("删除失败");
        }
    }
}
