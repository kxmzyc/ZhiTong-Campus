# 如何检测搜索筛选是前端实现还是后端实现

## 方法1：微信开发者工具网络监控（推荐）

### 操作步骤：

1. **打开微信开发者工具**
2. **点击"调试器" → "Network"标签**
3. **打开校招页面**
4. **执行以下测试：**

#### 测试A：初始加载
```
操作：打开页面
观察：查看 /api/job/list 请求

✅ 后端筛选：
- 请求URL: GET /api/job/list
- 返回数据：所有active状态的职位

❌ 前端筛选：
- 请求URL: GET /api/job/list
- 返回数据：所有职位（可能很多）
- 前端再用 filter() 筛选
```

#### 测试B：关键词搜索
```
操作：输入"前端"，点击搜索
观察：是否发送新的网络请求

✅ 后端筛选：
- 发送新请求
- 请求URL: GET /api/job/list?keyword=前端
- 返回数据：只包含标题或公司名含"前端"的职位
- 数据量明显减少

❌ 前端筛选：
- 不发送新请求
- 使用已加载的数据在前端filter
```

#### 测试C：城市筛选
```
操作：选择"北京"
观察：返回页面后的网络请求

✅ 后端筛选：
- 发送新请求
- 请求URL: GET /api/job/list?city=北京
- 返回数据：只包含北京的职位

❌ 前端筛选：
- 不发送新请求
- 前端从缓存数据中筛选
```

#### 测试D：组合筛选
```
操作：输入"Java" + 选择"上海" + 选择"互联网"
观察：网络请求参数

✅ 后端筛选：
- 请求URL: GET /api/job/list?keyword=Java&city=上海&industry=互联网
- 返回数据：同时满足三个条件的职位
- 数据量很少

❌ 前端筛选：
- 请求URL: GET /api/job/list（无参数）
- 返回数据：所有职位
- 前端多次filter筛选
```

---

## 方法2：查看响应数据量

### 操作步骤：

1. **清空所有筛选条件**
2. **查看返回的职位数量（假设100条）**
3. **添加筛选条件（如：城市=北京）**
4. **再次查看返回的职位数量**

```
✅ 后端筛选：
- 无筛选：返回100条数据
- 城市=北京：返回20条数据（网络传输量减少）

❌ 前端筛选：
- 无筛选：返回100条数据
- 城市=北京：仍返回100条数据（前端隐藏80条）
```

---

## 方法3：查看请求时机

### 操作步骤：

1. **打开Network标签**
2. **执行多次筛选操作**
3. **观察每次操作是否触发网络请求**

```
✅ 后端筛选：
- 每次筛选都发送新请求
- 可以看到多个 /api/job/list 请求
- 每个请求的参数不同

❌ 前端筛选：
- 只在页面加载时发送一次请求
- 后续筛选不发送请求
- Network标签无新请求
```

---

## 方法4：查看Console日志

### 操作步骤：

1. **打开"调试器" → "Console"标签**
2. **执行筛选操作**
3. **查看是否有警告信息**

```
❌ 前端筛选（旧代码）：
- 可能看到：refreshCompanies 方法已废弃，请使用 loadJobsFromBackend

✅ 后端筛选（新代码）：
- 看到：加载职位失败 或 正常的API响应日志
```

---

## 方法5：代码层面检查

### 检查 campus.js

```javascript
// ❌ 前端筛选特征
refreshCompanies() {
  const source = companiesByTab[active] || [];
  const list = source.filter((c) => {
    // 关键词筛选
    if (keyword && !c.name.includes(keyword)) return false;
    // 城市筛选
    if (city && c.city !== city) return false;
    return true;
  });
  this.setData({ companies: list });
}

// ✅ 后端筛选特征
loadJobsFromBackend() {
  const params = {};
  if (keyword) params.keyword = keyword;
  if (city) params.city = city;

  api.getJobList(params).then(res => {
    this.setData({ companies: res.data });
  });
}
```

---

## 方法6：性能测试

### 操作步骤：

1. **准备大量测试数据（如1000条职位）**
2. **测试搜索响应时间**

```
✅ 后端筛选：
- 数据量增加，响应时间基本不变
- 利用数据库索引，查询快
- 网络传输量小

❌ 前端筛选：
- 数据量增加，页面加载变慢
- 前端遍历所有数据，耗时增加
- 网络传输量大
```

---

## 实际测试示例

### 测试场景：搜索"前端"职位

#### 后端筛选（当前实现）

**Network请求：**
```
Request URL: http://localhost:8080/api/job/list?keyword=前端
Request Method: GET
Status Code: 200 OK

Response:
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "前端开发工程师",
      "company": "阿里巴巴",
      ...
    },
    {
      "id": 5,
      "title": "高级前端工程师",
      "company": "腾讯",
      ...
    }
  ]
}
```

**特征：**
- ✅ URL包含 `?keyword=前端`
- ✅ 只返回2条匹配数据
- ✅ 响应体积小（约2KB）

---

#### 前端筛选（旧实现）

**Network请求：**
```
Request URL: http://localhost:8080/api/job/list
Request Method: GET
Status Code: 200 OK

Response:
{
  "code": 200,
  "message": "success",
  "data": [
    // 100条职位数据
    { "id": 1, "title": "前端开发工程师", ... },
    { "id": 2, "title": "后端开发工程师", ... },
    { "id": 3, "title": "Java工程师", ... },
    ...
  ]
}
```

**特征：**
- ❌ URL无参数
- ❌ 返回所有100条数据
- ❌ 响应体积大（约50KB）
- ❌ 前端再用 `filter()` 筛选出2条

---

## 快速验证清单

| 检查项 | 后端筛选 | 前端筛选 |
|--------|----------|----------|
| 每次筛选是否发送新请求 | ✅ 是 | ❌ 否 |
| URL是否包含查询参数 | ✅ 是 | ❌ 否 |
| 返回数据量是否随筛选变化 | ✅ 是 | ❌ 否 |
| 是否有前端filter逻辑 | ❌ 否 | ✅ 是 |
| 数据量大时是否卡顿 | ❌ 否 | ✅ 是 |

---

## 推荐测试流程

1. **打开微信开发者工具**
2. **清除Network记录**
3. **打开校招页面** → 观察初始请求
4. **输入"Java"搜索** → 观察是否发送新请求，URL是否有 `?keyword=Java`
5. **选择城市"北京"** → 观察是否发送新请求，URL是否有 `?city=北京`
6. **查看返回数据量** → 是否只包含匹配的职位

如果以上都符合"后端筛选"特征，说明重构成功！
