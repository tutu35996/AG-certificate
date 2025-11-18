# 模板文件说明

## 📁 文件夹结构

请将对应的模板文件放入以下文件夹中（语言顺序固定）：

```
templates/
├── english/        # 英语
├── french/         # 法语
├── french_half/    # 法语（减半版）
├── arabic/         # 阿拉伯语
├── vietnamese/     # 越南语
├── armenian/       # 亚美尼亚语
├── spanish/        # 西班牙语
├── turkish/        # 土耳其语
├── ukrainian/      # 乌克兰语
├── persian/        # 波斯语
├── romanian/       # 罗马尼亚语
├── georgian/       # 格鲁吉亚语
├── portuguese/     # 葡萄牙语
└── signal_rewards/ # 信号奖励（按语言子项）
```

## 🎨 模板文件要求

### 文件格式
- **格式**: PNG (推荐) 或 JPG
- **尺寸**: 1152 x 2048 像素
- **分辨率**: 72-300 DPI

### 命名规范
以下语言/版本的命名规则一致，均需包含 `VIP1` - `VIP5` 五个等级：

- **英语 (templates/english/)**: English_VIP1.png ~ English_VIP5.png
- **法语 (templates/french/)**: French_VIP1.png ~ French_VIP5.png
- **法语（减半版）(templates/french_half/)**: FrenchHalf_VIP1.png ~ FrenchHalf_VIP5.png
- **阿拉伯语 (templates/arabic/)**: Arabic_VIP1.png ~ Arabic_VIP5.png
- **越南语 (templates/vietnamese/)**: Vietnamese_VIP1.png ~ Vietnamese_VIP5.png
- **亚美尼亚语 (templates/armenian/)**: Armenian_VIP1.png ~ Armenian_VIP5.png
- **西班牙语 (templates/spanish/)**: Spanish_VIP1.png ~ Spanish_VIP5.png
- **土耳其语 (templates/turkish/)**: Turkish_VIP1.png ~ Turkish_VIP5.png
- **乌克兰语 (templates/ukrainian/)**: Ukrainian_VIP1.png ~ Ukrainian_VIP5.png
- **波斯语 (templates/persian/)**: Persian_VIP1.png ~ Persian_VIP5.png
- **罗马尼亚语 (templates/romanian/)**: Romanian_VIP1.png ~ Romanian_VIP5.png
- **格鲁吉亚语 (templates/georgian/)**: Georgian_VIP1.png ~ Georgian_VIP5.png
- **葡萄牙语 (templates/portuguese/)**: Portuguese_VIP1.png ~ Portuguese_VIP5.png

### 信号奖励模板
- **目录**: `templates/signal_rewards/`
- **文件命名**: `Signal_<语言英文名首字母大写>.png`
- **包含语言**: English、Polish、Spanish、Ukrainian、Georgian、Portuguese、Romanian、Armenian

## ⚠️ 注意事项

1. **文件名必须完全匹配** - 包括大小写
2. **文件扩展名** - 使用 .png 或 .jpg
3. **如果某个模板不存在** - 系统会显示默认模板
4. **建议使用PNG格式** - 支持透明背景，效果更好

## 🔧 模板设计建议

### 设计要点
- 确保文字区域有足够的对比度
- 头像区域建议为圆形或方形
- 姓名和UID区域要清晰可见
- 保持整体设计的一致性

### 文字区域预留
- **头像区域**: 建议预留 400x400 像素的圆形区域
- **姓名区域**: 建议预留足够空间显示长姓名
- **UID区域**: 建议预留空间显示数字ID

## 📝 快速开始

1. 将你的模板图片重命名为对应的文件名
2. 放入对应的语言文件夹中
3. 打开浏览器访问 index.html
4. 选择对应的语言和VIP等级
5. 开始生成证书！

