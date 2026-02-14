// pages/company-detail/company-detail.js
const api = require('../../utils/api');

/**
 * Mock 数据仓库 - 四大互联网公司详情数据（降级方案）
 * 使用 Map 结构便于快速查找
 */
const MOCK_COMPANIES = {
  // 字节跳动 - ID: 103
  103: {
    id: 103,
    name: '北京字节跳动科技有限公司',
    logo: 'https://ui-avatars.com/api/?name=ByteDance&background=0052D9&color=fff&size=200&bold=true',
    industry: '移动互联网 / 内容分发',
    scale: '10000人以上',
    financingStatus: '已上市',
    jobCount: 1000,
    introduction: '字节跳动成立于2012年3月，是最早将人工智能应用于移动互联网场景的科技企业之一。公司以"Inspire Creativity, Enrich Life"（激发创造，丰富生活）为使命，致力于打造全球创作与交流平台。字节跳动的全球化布局始于2015年，"技术出海"是字节跳动全球化发展的核心战略。旗下产品包括今日头条、抖音、TikTok、西瓜视频、飞书等，深受全球用户喜爱。目前，字节跳动在全球40多个国家和地区设有办公室，员工总数超过15万人。',
    businessInfo: [
      { label: '法定代表人', value: '张一鸣' },
      { label: '注册资本', value: '1000000万人民币' },
      { label: '成立日期', value: '2012-03-12' },
      { label: '经营状态', value: '存续' },
      { label: '统一社会信用代码', value: '91110108593350273B' },
      { label: '组织机构代码', value: '593350273' },
      { label: '企业类型', value: '有限责任公司(自然人投资或控股)' },
      { label: '营业期限', value: '2012-03-12 至 无固定期限' },
      { label: '登记机关', value: '北京市海淀区市场监督管理局' },
      { label: '注册地址', value: '北京市海淀区北三环西路甲18号' },
      { label: '经营范围', value: '技术开发、技术推广、技术转让、技术咨询、技术服务；软件开发；应用软件服务；计算机系统服务；基础软件服务；销售自行开发后的产品；设计、制作、代理、发布广告；企业策划；企业管理咨询；市场调查；经济贸易咨询；组织文化艺术交流活动（不含营业性演出）；会议服务。' }
    ],
    jobList: [
      {
        id: 1031,
        title: '前端开发工程师（抖音方向）',
        salary: '25-50K',
        location: '北京',
        experience: '3-5年',
        tags: ['React', 'Vue3', 'TypeScript', '性能优化']
      },
      {
        id: 1032,
        title: '推荐算法工程师',
        salary: '35-70K',
        location: '北京',
        experience: '3-5年',
        tags: ['机器学习', '推荐系统', 'Python', 'TensorFlow']
      },
      {
        id: 1033,
        title: '后端开发工程师（基础架构）',
        salary: '30-60K',
        location: '北京',
        experience: '3-5年',
        tags: ['Go', '分布式系统', '微服务', 'Kubernetes']
      }
    ],
    interviewList: [
      {
        id: 10301,
        title: '字节跳动前端三轮面经（已offer）',
        author: '匿名用户',
        time: '2024-02-10',
        preview: '一共三轮技术面试加一轮HR面。一面主要考察JS基础、React原理、算法题（中等难度）。二面深入项目经验，问了很多性能优化的细节。三面是交叉面，偏向系统设计和工程化。整体感觉字节很看重基础和实战能力，面试官都很专业。'
      },
      {
        id: 10302,
        title: '推荐算法岗面试经验分享',
        author: '算法小白',
        time: '2024-02-05',
        preview: '算法岗竞争很激烈。一面手撕代码+机器学习基础，二面深入推荐系统原理和工程实践，三面是部门leader面，聊了很多业务理解和未来规划。建议提前准备推荐系统的经典论文和实际案例。'
      }
    ]
  },

  // 腾讯 - ID: 102
  102: {
    id: 102,
    name: '深圳市腾讯计算机系统有限公司',
    logo: 'https://ui-avatars.com/api/?name=Tencent&background=00A4FF&color=fff&size=200&bold=true',
    industry: '互联网 / 社交游戏',
    scale: '10000人以上',
    financingStatus: '已上市',
    jobCount: 800,
    introduction: '腾讯成立于1998年11月，是中国领先的互联网增值服务提供商之一。秉承"科技向善"的使命，腾讯致力于通过互联网服务提升人类生活品质。公司业务涵盖社交网络、数字内容、金融科技、企业服务等多个领域。旗下拥有微信、QQ、腾讯游戏、腾讯云、腾讯视频等知名产品。腾讯坚持"用户为本，科技向善"的价值观，连接一切，让生活更美好。目前腾讯在全球多个国家和地区设有分支机构，员工总数超过10万人。',
    businessInfo: [
      { label: '法定代表人', value: '马化腾' },
      { label: '注册资本', value: '650000万人民币' },
      { label: '成立日期', value: '1998-11-11' },
      { label: '经营状态', value: '存续' },
      { label: '统一社会信用代码', value: '91440300708461136T' },
      { label: '组织机构代码', value: '708461136' },
      { label: '企业类型', value: '有限责任公司' },
      { label: '营业期限', value: '1998-11-11 至 无固定期限' },
      { label: '登记机关', value: '深圳市市场监督管理局' },
      { label: '注册地址', value: '广东省深圳市南山区粤海街道麻岭社区科技中一路腾讯大厦' },
      { label: '经营范围', value: '计算机软硬件的技术开发、销售及相关技术服务；互联网信息服务；增值电信业务；网络游戏研发与运营；广告业务；投资兴办实业；国内贸易；经营进出口业务。' }
    ],
    jobList: [
      {
        id: 1021,
        title: '微信后端开发工程师',
        salary: '30-60K',
        location: '深圳',
        experience: '3-5年',
        tags: ['C++', '高并发', '分布式', '微服务']
      },
      {
        id: 1022,
        title: '游戏客户端开发工程师',
        salary: '25-50K',
        location: '深圳',
        experience: '3-5年',
        tags: ['Unity3D', 'C#', '游戏引擎', '性能优化']
      },
      {
        id: 1023,
        title: '腾讯云架构师',
        salary: '40-80K',
        location: '深圳',
        experience: '5-10年',
        tags: ['云计算', 'Kubernetes', '架构设计', 'DevOps']
      }
    ],
    interviewList: [
      {
        id: 10201,
        title: '腾讯微信事业群后端面经',
        author: '后端开发者',
        time: '2024-02-08',
        preview: '腾讯的面试流程很规范，一共四轮。前三轮技术面，最后一轮GM面。技术面主要考察C++基础、数据结构算法、系统设计能力。面试官会深挖项目细节，特别关注高并发场景的处理经验。整体氛围很好，面试官都很nice。'
      },
      {
        id: 10202,
        title: '游戏策划岗位面试分享',
        author: '游戏爱好者',
        time: '2024-01-28',
        preview: '游戏策划面试主要考察游戏理解、数值设计、玩法创新能力。需要准备作品集和游戏分析报告。面试官会让你现场设计一个小玩法，考察逻辑思维和创意能力。建议多玩腾讯的游戏产品，了解其设计理念。'
      }
    ]
  },

  // 阿里巴巴 - ID: 101
  101: {
    id: 101,
    name: '阿里巴巴（中国）有限公司',
    logo: 'https://ui-avatars.com/api/?name=Alibaba&background=FF6A00&color=fff&size=200&bold=true',
    industry: '互联网 / 电商云服务',
    scale: '10000人以上',
    financingStatus: '已上市',
    jobCount: 1200,
    introduction: '阿里巴巴集团创立于1999年，是全球领先的数字经济体。秉承"让天下没有难做的生意"的使命，阿里巴巴致力于构建未来商业基础设施。集团业务包括电子商务、云计算、数字媒体及娱乐、创新业务等。旗下拥有淘宝、天猫、阿里云、菜鸟网络、蚂蚁集团等知名品牌。阿里巴巴坚持"客户第一、员工第二、股东第三"的价值观，通过技术创新推动商业变革。目前阿里巴巴在全球多个国家和地区开展业务，员工总数超过25万人。',
    businessInfo: [
      { label: '法定代表人', value: '张勇' },
      { label: '注册资本', value: '8200000万人民币' },
      { label: '成立日期', value: '1999-09-09' },
      { label: '经营状态', value: '存续' },
      { label: '统一社会信用代码', value: '91330000727412769J' },
      { label: '组织机构代码', value: '727412769' },
      { label: '企业类型', value: '有限责任公司' },
      { label: '营业期限', value: '1999-09-09 至 无固定期限' },
      { label: '登记机关', value: '浙江省市场监督管理局' },
      { label: '注册地址', value: '浙江省杭州市余杭区五常街道文一西路969号' },
      { label: '经营范围', value: '计算机软硬件、电子产品的技术开发、技术服务；经济信息咨询；数据库服务；设计、制作、代理、发布国内广告；电子商务平台的开发建设；云计算、大数据技术服务；供应链管理；物流信息咨询。' }
    ],
    jobList: [
      {
        id: 1011,
        title: 'Java高级开发工程师（淘宝）',
        salary: '30-60K',
        location: '杭州',
        experience: '3-5年',
        tags: ['Java', 'Spring Cloud', '高并发', '分布式']
      },
      {
        id: 1012,
        title: '阿里云解决方案架构师',
        salary: '35-70K',
        location: '杭州',
        experience: '5-10年',
        tags: ['云计算', '架构设计', 'Kubernetes', '大数据']
      },
      {
        id: 1013,
        title: '前端技术专家（P7）',
        salary: '40-80K',
        location: '杭州',
        experience: '5-10年',
        tags: ['React', 'Node.js', '前端架构', '工程化']
      }
    ],
    interviewList: [
      {
        id: 10101,
        title: '阿里P6 Java开发面经（三面已过）',
        author: '技术小白',
        time: '2024-02-12',
        preview: '阿里的面试难度确实不小。一面主要考察Java基础、JVM、多线程、MySQL等。二面深入分布式系统、微服务架构、中间件原理。三面是交叉面，考察系统设计和业务理解。建议提前准备阿里的技术栈，多看看阿里技术博客。'
      },
      {
        id: 10102,
        title: '阿里云架构师面试经验',
        author: '云计算工程师',
        time: '2024-02-01',
        preview: '架构师岗位面试更注重实战经验和架构能力。面试官会让你设计一个完整的云上系统架构，考察技术选型、成本优化、高可用设计等。需要对阿里云产品有深入了解，最好有实际项目经验。整体面试时间较长，要做好准备。'
      }
    ]
  },

  // 网易 - ID: 201
  201: {
    id: 201,
    name: '网易（杭州）网络有限公司',
    logo: 'https://ui-avatars.com/api/?name=NetEase&background=D32F2F&color=fff&size=200&bold=true',
    industry: '互联网 / 游戏音乐',
    scale: '10000人以上',
    financingStatus: '已上市',
    jobCount: 600,
    introduction: '网易成立于1997年，是中国领先的互联网技术公司。秉承"有态度的互联网公司"理念，网易致力于为用户提供优质的互联网产品和服务。公司业务涵盖游戏、音乐、教育、电商、邮箱等多个领域。旗下拥有网易游戏、网易云音乐、网易有道、网易严选等知名品牌。网易坚持精品战略，注重产品品质和用户体验，以创新驱动发展。目前网易在全球多个国家和地区设有分支机构，员工总数超过3万人。',
    businessInfo: [
      { label: '法定代表人', value: '丁磊' },
      { label: '注册资本', value: '200000万人民币' },
      { label: '成立日期', value: '1997-06-24' },
      { label: '经营状态', value: '存续' },
      { label: '统一社会信用代码', value: '91330000633986067Q' },
      { label: '组织机构代码', value: '633986067' },
      { label: '企业类型', value: '有限责任公司' },
      { label: '营业期限', value: '1997-06-24 至 无固定期限' },
      { label: '登记机关', value: '浙江省市场监督管理局' },
      { label: '注册地址', value: '浙江省杭州市滨江区长河街道网商路599号' },
      { label: '经营范围', value: '互联网信息服务；游戏软件开发与运营；计算机软硬件技术开发；网络技术服务；广告设计、制作、代理、发布；电子商务；教育咨询；文化艺术交流活动策划；会议及展览服务。' }
    ],
    jobList: [
      {
        id: 2011,
        title: '游戏开发工程师（Unity）',
        salary: '20-40K',
        location: '杭州',
        experience: '3-5年',
        tags: ['Unity3D', 'C#', '游戏逻辑', 'Shader']
      },
      {
        id: 2012,
        title: '音乐推荐算法工程师',
        salary: '25-50K',
        location: '杭州',
        experience: '3-5年',
        tags: ['推荐算法', '机器学习', 'Python', 'Spark']
      },
      {
        id: 2013,
        title: 'iOS开发工程师',
        salary: '22-45K',
        location: '杭州',
        experience: '3-5年',
        tags: ['Swift', 'Objective-C', 'iOS SDK', '性能优化']
      }
    ],
    interviewList: [
      {
        id: 20101,
        title: '网易游戏客户端面经分享',
        author: '游戏开发者',
        time: '2024-02-06',
        preview: '网易游戏的面试很注重实际项目经验。一面考察Unity基础、C#语言、游戏开发流程。二面深入游戏性能优化、内存管理、热更新方案。三面是项目负责人面，聊了很多游戏设计理念和团队协作。整体氛围轻松，面试官都是游戏行业的资深人士。'
      },
      {
        id: 20102,
        title: '网易云音乐前端面试经验',
        author: '前端工程师',
        time: '2024-01-25',
        preview: '云音乐前端团队技术氛围很好。面试主要考察React、Vue框架原理、前端工程化、性能优化等。会有一道算法题，难度中等。面试官很专业，会根据简历深挖项目细节。建议提前了解云音乐的产品特点和技术栈。'
      }
    ]
  }
};

Page({

  /**
   * 页面的初始数据
   * 注意：所有数据初始化为空，由 onLoad 动态加载
   */
  data: {
    companyId: null,
    activeTab: 0,
    isFollowed: false,
    introExpanded: false,
    companyInfo: {
      id: null,
      name: '',
      logo: '',
      industry: '',
      scale: '',
      financingStatus: '',
      jobCount: 0,
      introduction: ''
    },
    businessInfo: [],
    jobList: [],
    interviewList: []
  },

  /**
   * 生命周期函数--监听页面加载
   * @param {Object} options - 页面参数，包含公司ID
   */
  onLoad(options) {
    // 调试日志：打印接收到的参数
    console.log('=== company-detail onLoad ===');
    console.log('接收到的参数:', options);
    console.log('原始 ID:', options.id);
    console.log('ID 类型:', typeof options.id);

    // 获取传入的公司ID，兼容字符串和数字类型
    // 注意：微信小程序路由传参都是字符串，需要转换为数字
    const companyId = options.id ? parseInt(options.id) : null;

    console.log('转换后的 ID:', companyId);
    console.log('转换后类型:', typeof companyId);

    // 从后端加载公司信息
    this.loadCompanyDetail(companyId);

    // 从后端加载职位列表
    this.loadJobList(companyId);
  },

  /**
   * 加载公司详情数据
   * @param {Number} companyId - 公司ID
   */
  loadCompanyDetail(companyId) {
    console.log('=== loadCompanyDetail ===');
    console.log('查找公司 ID:', companyId);

    wx.showLoading({ title: '加载中...' });

    // 从后端加载公司详情
    api.getCompanyDetail(companyId)
      .then(res => {
        wx.hideLoading();
        if (res.code === 200 && res.data) {
          const company = res.data;
          console.log('✅ 成功加载公司数据:', company.name);

          // 更新页面数据
          this.setData({
            companyId: company.id,
            companyInfo: {
              id: company.id,
              name: company.name,
              logo: company.logo,
              industry: company.industry,
              scale: company.scale,
              financingStatus: company.financingStatus,
              jobCount: company.jobCount,
              introduction: company.introduction
            },
            businessInfo: JSON.parse(company.businessInfo || '[]'), // 解析工商信息
            interviewList: [] // 后端暂无面经列表，使用空数组
          });

          console.log('页面数据更新完成');
        } else {
          throw new Error('数据格式错误');
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('❌ 加载公司详情失败:', err);

        // 降级方案：尝试从 Mock 数据加载
        this.loadCompanyDetailFromMock(companyId);
      });
  },

  /**
   * 从 Mock 数据加载公司详情（降级方案）
   * @param {Number} companyId - 公司ID
   */
  loadCompanyDetailFromMock(companyId) {
    console.log('使用 Mock 数据作为降级方案');

    // 从Mock数据仓库中查找公司数据
    let companyData = MOCK_COMPANIES[companyId];

    // 如果找不到对应ID的公司，显示错误提示
    if (!companyData) {
      console.error(`❌ 未找到ID为 ${companyId} 的公司数据`);
      console.error('可用的公司ID列表:', Object.keys(MOCK_COMPANIES));

      wx.showToast({
        title: `未找到公司数据: ${companyId}`,
        icon: 'none',
        duration: 3000
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        });
      }, 2000);

      return;
    }

    console.log('✅ 成功找到公司数据:', companyData.name);

    // 更新页面数据
    this.setData({
      companyId: companyId,
      companyInfo: {
        id: companyData.id,
        name: companyData.name,
        logo: companyData.logo,
        industry: companyData.industry,
        scale: companyData.scale,
        financingStatus: companyData.financingStatus,
        jobCount: companyData.jobCount,
        introduction: companyData.introduction
      },
      businessInfo: companyData.businessInfo,
      jobList: companyData.jobList,
      interviewList: companyData.interviewList
    });

    console.log('页面数据更新完成');
  },

  /**
   * 从后端加载职位列表
   * @param {Number} companyId - 公司ID
   */
  loadJobList(companyId) {
    console.log('=== loadJobList ===');
    console.log('加载公司职位，公司ID:', companyId);

    // 调用后端接口获取职位列表
    api.getJobList({ companyId })
      .then(res => {
        if (res.code === 200 && res.data) {
          console.log('✅ 成功加载职位数据，共', res.data.length, '个职位');

          // 处理职位数据
          const jobList = res.data.map(job => ({
            id: job.id,
            title: job.title,
            salary: `${job.salaryMin}-${job.salaryMax}K`, // 拼接薪资范围
            location: job.city, // 后端字段是 city，前端是 location
            experience: job.experience,
            tags: JSON.parse(job.tags || '[]') // 解析 JSON 字符串为数组
          }));

          // 更新页面数据
          this.setData({ jobList });
          console.log('职位列表更新完成');
        } else {
          throw new Error('职位数据格式错误');
        }
      })
      .catch(err => {
        console.error('❌ 加载职位列表失败:', err);
        // 失败时使用 Mock 数据中的职位列表（如果有的话）
        const mockData = MOCK_COMPANIES[companyId];
        if (mockData && mockData.jobList) {
          console.log('使用 Mock 职位数据作为降级方案');
          this.setData({ jobList: mockData.jobList });
        }
      });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 分享
   */
  onShare() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  /**
   * 切换关注状态
   */
  toggleFollow() {
    this.setData({
      isFollowed: !this.data.isFollowed
    });
    wx.showToast({
      title: this.data.isFollowed ? '关注成功' : '取消关注',
      icon: 'success'
    });
  },

  /**
   * 切换Tab
   */
  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index
    });
  },

  /**
   * 展开/收起公司介绍
   */
  toggleIntro() {
    this.setData({
      introExpanded: !this.data.introExpanded
    });
  },

  /**
   * 跳转到职位详情
   */
  goToJobDetail(e) {
    const jobId = e.currentTarget.dataset.id;
    console.log('点击职位卡片，职位ID:', jobId);
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?id=${jobId}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `${this.data.companyInfo.name} - 职通校园`,
      path: `/pages/company-detail/company-detail?id=${this.data.companyId}`
    };
  }
})
