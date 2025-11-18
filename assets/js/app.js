// ag证书生成器 v2.0 - 主要JavaScript逻辑

class CertificateGenerator {
  constructor() {
    this.canvas = document.getElementById('certificateCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 1152;
    this.canvas.height = 2048;
    this.nameInput = document.getElementById('nameInput');
    this.uidInput = document.getElementById('uidInput');
    this.avatarUpload = document.getElementById('avatarUpload');
    this.coordsDisplay = document.getElementById('coordsDisplay');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.errorOverlay = document.getElementById('errorOverlay');
    this.retryBtn = document.getElementById('retryBtn');
    this.fontFamily = 'TheSeasonsBoldItalic';
    this.valueEls = {
      avatar: {
        x: document.getElementById('avatarXValue'),
        y: document.getElementById('avatarYValue'),
        size: document.getElementById('avatarSizeValue')
      },
      name: {
        x: document.getElementById('nameXValue'),
        y: document.getElementById('nameYValue'),
        size: document.getElementById('nameSizeValue')
      },
      uid: {
        x: document.getElementById('uidXValue'),
        y: document.getElementById('uidYValue'),
        size: document.getElementById('uidSizeValue')
      }
    };
    
    // 模板配置
    this.signalVariantNames = {
      english: '英语',
      polish: '波兰语',
      spanish: '西班牙语',
      ukrainian: '乌克兰语',
      georgian: '格鲁吉亚语',
      portuguese: '葡萄牙语',
      romanian: '罗马尼亚语',
      armenian: '亚美尼亚语'
    };
    this.templates = {
      signal_rewards: this.buildSignalRewardSet(),
      english: this.buildVipSet('english', 'English'),
      french: this.buildVipSet('french', 'French'),
      french_half: this.buildVipSet('french_half', 'FrenchHalf'),
      arabic: this.buildVipSet('arabic', 'Arabic'),
      vietnamese: this.buildVipSet('vietnamese', 'Vietnamese'),
      armenian: this.buildVipSet('armenian', 'Armenian'),
      spanish: this.buildVipSet('spanish', 'Spanish'),
      turkish: this.buildVipSet('turkish', 'Turkish'),
      ukrainian: this.buildVipSet('ukrainian', 'Ukrainian'),
      persian: this.buildVipSet('persian', 'Persian'),
      romanian: this.buildVipSet('romanian', 'Romanian'),
      georgian: this.buildVipSet('georgian', 'Georgian'),
      portuguese: this.buildVipSet('portuguese', 'Portuguese')
    };
    
    // 当前状态
    this.template = new Image();
    this.currentCountry = 'english';
    this.currentVip = '1';
    this.avatar = null;
    
    // 位置和大小参数
    this.avatarX = 81;
    this.avatarY = 665;
    this.avatarSize = 290;
    this.nameX = 618;
    this.nameY = 751;
    this.nameSize = 66;
    this.uidX = 843;
    this.uidY = 780;
    this.uidSize = 46;
    this.avatarDefaults = {
      standard: { x: 81, y: 665, size: 290 },
      signal: { x: 96, y: 685, size: 290 }
    };
    this.uidDefaults = {
      standard: { x: 843, y: 780, size: 46 },
      signal: { x: 825, y: 795, size: 54 }
    };
    
    // 拖拽状态
    this.dragging = null;
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.init();
  }

  buildVipSet(folder, displayName) {
    return {
      1: `templates/${folder}/${displayName}_VIP1.png`,
      2: `templates/${folder}/${displayName}_VIP2.png`,
      3: `templates/${folder}/${displayName}_VIP3.png`,
      4: `templates/${folder}/${displayName}_VIP4.png`,
      5: `templates/${folder}/${displayName}_VIP5.png`
    };
  }
  
  buildSignalRewardSet() {
    return {
      english: "templates/signal_rewards/Signal_English.png",
      polish: "templates/signal_rewards/Signal_Polish.png",
      spanish: "templates/signal_rewards/Signal_Spanish.png",
      ukrainian: "templates/signal_rewards/Signal_Ukrainian.png",
      georgian: "templates/signal_rewards/Signal_Georgian.png",
      portuguese: "templates/signal_rewards/Signal_Portuguese.png",
      romanian: "templates/signal_rewards/Signal_Romanian.png",
      armenian: "templates/signal_rewards/Signal_Armenian.png"
    };
  }
  
  init() {
    this.setupEventListeners();
    // 初始显示加载动画
    this.showLoading();
    this.loadTemplate();
  }
  
  setupEventListeners() {
    // 国家标题点击事件（手风琴效果）
    document.querySelectorAll('.country-title').forEach(title => {
      title.addEventListener('click', () => {
        this.toggleCountry(title);
      });
    });
    
    // 模板选择事件
    document.querySelectorAll('.vip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectTemplate(btn);
      });
    });
    
    // 头像上传
    this.avatarUpload.addEventListener('change', (e) => {
      this.handleAvatarUpload(e);
    });
    
    // 粘贴上传头像
    document.addEventListener('paste', (e) => {
      this.handlePasteUpload(e);
    });
    
    // 拖拽事件
    this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
    this.canvas.addEventListener('mousemove', (e) => this.duringDrag(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrag());
    this.canvas.addEventListener('mouseleave', () => this.stopDrag());
    
    // 大小调整按钮
    document.getElementById('nameBigger').onclick = () => { this.nameSize = Math.min(this.nameSize + 4, 200); this.drawAll(); };
    document.getElementById('nameSmaller').onclick = () => { this.nameSize = Math.max(this.nameSize - 4, 24); this.drawAll(); };
    document.getElementById('uidBigger').onclick = () => { this.uidSize = Math.min(this.uidSize + 2, 160); this.drawAll(); };
    document.getElementById('uidSmaller').onclick = () => { this.uidSize = Math.max(this.uidSize - 2, 24); this.drawAll(); };
    document.getElementById('avatarBigger').onclick = () => { this.resizeAvatar(10); };
    document.getElementById('avatarSmaller').onclick = () => { this.resizeAvatar(-10); };
    document.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        const dx = parseInt(btn.dataset.dx) || 0;
        const dy = parseInt(btn.dataset.dy) || 0;
        this.moveElement(target, dx, dy);
      });
    });
    
    // 下载功能
    document.getElementById('downloadBtn').onclick = () => this.downloadCertificate();
    
    // 重试按钮
    if (this.retryBtn) {
      this.retryBtn.addEventListener('click', () => {
        this.loadTemplate();
      });
    }
    
    // 输入监听
    this.nameInput.addEventListener('input', () => this.drawAll());
    this.uidInput.addEventListener('input', () => this.drawAll());
    
    this.expandDefaultPanel();
  }

  expandDefaultPanel() {
    const targetTitle = document.querySelector(`.country-title[data-country="${this.currentCountry}"]`) || document.querySelector('.country-title');
    if (targetTitle) {
      const country = targetTitle.dataset.country;
      const vipGrid = document.querySelector(`.vip-grid[data-country="${country}"]`);
      if (vipGrid) {
        vipGrid.classList.add('expanded');
        targetTitle.classList.remove('collapsed');
      }
    }

    const targetBtn = document.querySelector(`.vip-btn[data-country="${this.currentCountry}"][data-vip="${this.currentVip}"]`)
      || document.querySelector('.vip-btn');
    if (targetBtn) {
      targetBtn.classList.add('active');
    }
  }
  
  toggleCountry(clickedTitle) {
    const country = clickedTitle.dataset.country;
    const vipGrid = document.querySelector(`.vip-grid[data-country="${country}"]`);
    const isExpanded = vipGrid.classList.contains('expanded');
    
    // 关闭所有其他国家
    document.querySelectorAll('.vip-grid').forEach(grid => {
      grid.classList.remove('expanded');
    });
    document.querySelectorAll('.country-title').forEach(title => {
      title.classList.add('collapsed');
    });
    
    // 如果点击的是当前展开的国家，则关闭；否则展开
    if (!isExpanded) {
      vipGrid.classList.add('expanded');
      clickedTitle.classList.remove('collapsed');
    }
  }
  
  selectTemplate(btn) {
    // 移除所有活动状态
    document.querySelectorAll('.vip-btn').forEach(b => b.classList.remove('active'));
    
    // 添加当前活动状态
    btn.classList.add('active');
    
    // 更新当前选择
    this.currentCountry = btn.dataset.country;
    this.currentVip = btn.dataset.vip;
    this.applyTemplateDefaults();
    
    // 加载新模板
    this.loadTemplate();
  }
  
  applyTemplateDefaults() {
    if (this.currentCountry === 'signal_rewards') {
      this.setAvatarDefaults(this.avatarDefaults.signal);
      this.setUidDefaults(this.uidDefaults.signal);
    } else {
      this.setAvatarDefaults(this.avatarDefaults.standard);
      this.setUidDefaults(this.uidDefaults.standard);
    }
  }

  setAvatarDefaults(config) {
    if (!config) return;
    this.avatarX = config.x;
    this.avatarY = config.y;
    this.avatarSize = config.size;
  }

  setUidDefaults(config) {
    if (!config) return;
    this.uidX = config.x;
    this.uidY = config.y;
    this.uidSize = config.size;
  }
  
  loadTemplate() {
    // 隐藏错误提示，显示加载动画
    this.hideError();
    this.showLoading();
    
    const templateMap = this.templates[this.currentCountry];
    const templatePath = templateMap ? templateMap[this.currentVip] : null;
    if (!templatePath) {
      this.hideLoading();
      this.showError();
      return;
    }
    this.template.onload = () => {
      this.hideLoading();
      this.drawAll();
    };
    
    this.template.onerror = () => {
      console.warn(`模板文件 ${templatePath} 未找到`);
      this.hideLoading();
      this.showError();
    };

    this.template.src = templatePath;
  }
  
  showLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('hidden');
    }
  }
  
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
    }
  }
  
  showError() {
    if (this.errorOverlay) {
      this.errorOverlay.classList.remove('hidden');
    }
  }
  
  hideError() {
    if (this.errorOverlay) {
      this.errorOverlay.classList.add('hidden');
    }
  }
  
  handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
      this.loadAvatarFromFile(file);
    }
  }
  
  handlePasteUpload(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        this.loadAvatarFromFile(file);
        e.preventDefault();
        break;
      }
    }
  }
  
  loadAvatarFromFile(file) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.avatar = new Image();
        this.avatar.onload = () => this.drawAll();
        this.avatar.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  drawAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.template && this.template.complete && this.template.naturalWidth > 0) {
      this.ctx.drawImage(this.template, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制头像（圆形裁切 + object-fit: cover 居中填充）
    if (this.avatar) {
      const imgW = this.avatar.width;
      const imgH = this.avatar.height;
      const cropSide = Math.min(imgW, imgH);
      const sx = (imgW - cropSide) / 2;
      const sy = (imgH - cropSide) / 2;

      this.ctx.save();
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
      this.ctx.beginPath();
      this.ctx.arc(
        this.avatarX + this.avatarSize / 2,
        this.avatarY + this.avatarSize / 2,
        this.avatarSize / 2,
        0,
        Math.PI * 2
      );
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.drawImage(
        this.avatar,
        sx,
        sy,
        cropSide,
        cropSide,
        this.avatarX,
        this.avatarY,
        this.avatarSize,
        this.avatarSize
      );
      this.ctx.restore();
    }

    // 绘制姓名：白色字体 + 黑色阴影 + 白色光晕
    this.ctx.save();
    this.ctx.font = this.getFont(this.nameSize);
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = "white";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(this.nameInput.value, this.nameX, this.nameY);

    // 增加白色发光层（叠加）
    this.ctx.shadowColor = "white";
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 25;
    this.ctx.fillText(this.nameInput.value, this.nameX, this.nameY);
    this.ctx.restore();

    // 绘制 UID：白色字体 + 黑色阴影
    this.ctx.save();
    this.ctx.font = this.getUidFont(this.uidSize);
    this.ctx.fillStyle = "white";
    this.ctx.shadowColor = "black";
    this.ctx.shadowOffsetX = 3;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.fillText(this.uidInput.value, this.uidX, this.uidY);
    this.ctx.restore();

    // 更新坐标显示
    this.updateCoordsDisplay();
    this.updateValueDisplays();
  }
  
  updateCoordsDisplay() {
    const countryNames = {
      signal_rewards: '信号奖励',
      english: '英语',
      french: '法语',
      french_half: '法语（减半）',
      arabic: '阿拉伯语',
      vietnamese: '越南语',
      armenian: '亚美尼亚语',
      spanish: '西班牙语',
      turkish: '土耳其语',
      ukrainian: '乌克兰语',
      persian: '波斯语',
      romanian: '罗马尼亚语',
      georgian: '格鲁吉亚语',
      portuguese: '葡萄牙语'
    };
    
    const countryName = countryNames[this.currentCountry] || this.currentCountry;
    const isSignal = this.currentCountry === 'signal_rewards';
    const variantLabel = isSignal
      ? (this.signalVariantNames[this.currentVip] || this.currentVip)
      : `VIP${this.currentVip}`;
    
    this.coordsDisplay.textContent =
      `当前模板：${countryName} ${variantLabel}\n` +
      `头像：X=${Math.round(this.avatarX)} Y=${Math.round(this.avatarY)} 尺寸=${Math.round(this.avatarSize)}\n` +
      `姓名：X=${Math.round(this.nameX)} Y=${Math.round(this.nameY)} 字号=${Math.round(this.nameSize)}\n` +
      `UID：X=${Math.round(this.uidX)} Y=${Math.round(this.uidY)} 字号=${Math.round(this.uidSize)}`;
  }

  updateValueDisplays() {
    const format = (value) => Math.round(value);
    const setText = (el, value) => { if (el) el.textContent = format(value); };

    if (this.valueEls.avatar) {
      setText(this.valueEls.avatar.x, this.avatarX);
      setText(this.valueEls.avatar.y, this.avatarY);
      setText(this.valueEls.avatar.size, this.avatarSize);
    }
    if (this.valueEls.name) {
      setText(this.valueEls.name.x, this.nameX);
      setText(this.valueEls.name.y, this.nameY);
      setText(this.valueEls.name.size, this.nameSize);
    }
    if (this.valueEls.uid) {
      setText(this.valueEls.uid.x, this.uidX);
      setText(this.valueEls.uid.y, this.uidY);
      setText(this.valueEls.uid.size, this.uidSize);
    }
  }
  
  startDrag(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    
    // 计算文本宽度
    this.ctx.font = this.getFont(this.nameSize);
    const nameWidth = this.ctx.measureText(this.nameInput.value || '姓名').width;
    const nameHalf = nameWidth / 2;
    this.ctx.font = this.getUidFont(this.uidSize);
    const uidWidth = this.ctx.measureText(this.uidInput.value).width || 50; // 如果为空，给一个默认宽度
    
    // 检查姓名区域
    const nameHit =
      mouseX > this.nameX - nameHalf &&
      mouseX < this.nameX + nameHalf &&
      mouseY < this.nameY &&
      mouseY > this.nameY - this.nameSize;
    
    // 检查UID区域 - 使用简化的固定区域检测
    const uidHit = mouseX > this.uidX - 30 && mouseX < this.uidX + 200 && mouseY > this.uidY - 50 && mouseY < this.uidY + 20;
    
    const avatarCenterX = this.avatarX + this.avatarSize / 2;
    const avatarCenterY = this.avatarY + this.avatarSize / 2;
    const avatarHit = Math.hypot(mouseX - avatarCenterX, mouseY - avatarCenterY) <= this.avatarSize / 2;

    if (avatarHit) {
      this.dragging = 'avatar';
    } else if (nameHit) {
      this.dragging = 'name';
    } else if (uidHit) {
      this.dragging = 'uid';
    }
    
    this.offsetX = mouseX;
    this.offsetY = mouseY;
  }
  
  duringDrag(e) {
    if (!this.dragging) return;
    
    const dx = e.offsetX - this.offsetX;
    const dy = e.offsetY - this.offsetY;
    
    if (this.dragging === 'avatar') {
      this.avatarX += dx;
      this.avatarY += dy;
      this.clampAvatar();
    }
    if (this.dragging === 'name') { 
      this.nameX += dx; 
      this.nameY += dy; 
      this.clampText('name');
    }
    if (this.dragging === 'uid') { 
      this.uidX += dx; 
      this.uidY += dy; 
      this.clampText('uid');
    }
    
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;
    this.drawAll();
  }
  
  stopDrag() {
    this.dragging = null;
  }
  
  downloadCertificate() {
    if (this.loadingOverlay && !this.loadingOverlay.classList.contains('hidden')) {
      alert('模板仍在加载中，请稍候再试');
      return;
    }
    if (this.errorOverlay && !this.errorOverlay.classList.contains('hidden')) {
      alert('模板加载失败，无法生成证书，请先重新加载模板');
      return;
    }

    this.drawAll();

    this.canvas.toBlob((blob) => {
      if (!blob) {
        alert('生成图片失败，请重试');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = this.getDownloadFilename();
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  resizeAvatar(delta) {
    this.avatarSize = Math.min(Math.max(this.avatarSize + delta, 80), Math.min(this.canvas.width, this.canvas.height));
    this.clampAvatar();
    this.drawAll();
  }

  clampAvatar() {
    this.avatarX = Math.min(Math.max(this.avatarX, 0), this.canvas.width - this.avatarSize);
    this.avatarY = Math.min(Math.max(this.avatarY, 0), this.canvas.height - this.avatarSize);
  }

  clampText(type) {
    const padding = 20;
    const isName = type === 'name';
    const fontSize = isName ? this.nameSize : this.uidSize;
    const value = isName ? (this.nameInput.value || '姓名') : (this.uidInput.value || 'UID');
    this.ctx.font = this.getUidFont(fontSize);
    const width = Math.max(this.ctx.measureText(value).width, 120);
    const halfWidth = width / 2;
    const maxX = this.canvas.width - width - padding;
    const minY = fontSize;
    if (isName) {
      this.nameX = Math.min(Math.max(this.nameX, halfWidth + padding), this.canvas.width - halfWidth - padding);
      this.nameY = Math.min(Math.max(this.nameY, minY), this.canvas.height - padding);
    } else {
      this.uidX = Math.min(Math.max(this.uidX, padding), maxX);
      this.uidY = Math.min(Math.max(this.uidY, minY), this.canvas.height - padding);
    }
  }

  moveElement(target, dx, dy) {
    if (target === 'avatar') {
      this.avatarX += dx;
      this.avatarY += dy;
      this.clampAvatar();
    } else if (target === 'name') {
      this.nameX += dx;
      this.nameY += dy;
      this.clampText('name');
    } else if (target === 'uid') {
      this.uidX += dx;
      this.uidY += dy;
      this.clampText('uid');
    }
    this.drawAll();
  }

  getFont(size) {
    return `${size}px "${this.fontFamily}", "TheSeasonsItalic", "TheSeasonsLight", Arial, sans-serif`;
  }

  getUidFont(size) {
    return `${size}px Arial, sans-serif`;
  }

  getDownloadFilename() {
    const countryCode = this.currentCountry.toUpperCase();
    if (this.currentCountry === 'signal_rewards') {
      const variant = (this.currentVip || '').toUpperCase();
      return `ag证书_${countryCode}_SIGNAL_${variant}.png`;
    }
    return `ag证书_${countryCode}_VIP${this.currentVip}.png`;
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  new CertificateGenerator();
});
