const Joi = require("joi");
//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    buyer: Joi.object({
      avatarUrl: Joi.string().required(),
      username: Joi.string().min(6).max(50).required(),
      password: Joi.string().min(6).max(1024).required(),
      email: Joi.string().min(6).max(100).required().email(),
      name: Joi.string()
        .min(1)
        .max(50)
        .regex(/^[\u4E00-\u9FFF]+$/)
        .required(),
      address: Joi.string().min(10).max(500).required(),
      sex: Joi.string().valid("男性", "女性", "其他").required(),
    }),
    seller: Joi.object({
      sellerAvatarUrl: Joi.string().allow(null), //允許為null
      shopname: Joi.string().min(6).max(50).allow(null), //允許為null
    }),
  });
  return schema.validate(data);
};

//login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

//product validation
const productValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    categories: Joi.string()
      .valid(
        "精選",
        "雜貨",
        "服飾",
        "電子產品",
        "電子遊戲",
        "家俱",
        "玩具",
        "嬰兒",
        "汽車",
        "電影",
        "書籍",
        "健康",
        "個人護理",
        "美妝",
        "寵物",
        "家庭用品",
        "運動",
        "辦公",
        "慶祝",
        "藝術",
        "禮品",
        "其他"
      )
      .required(),
    description: Joi.string().max(150).required(),
    inventory: Joi.number().min(1).integer().required(),
    price: Joi.number().min(0).max(9999).integer().required(),
    buyers: Joi.array().items(
      Joi.object({
        buyerId: Joi.string().hex().length(24).required().allow(null),
        quantity: Joi.number().min(0).required().allow(null),
      })
    ),
    shopname: Joi.string().min(6).max(50).required(),
  }).options({ stripUnknown: true }); // 忽略未知的屬性;
  return schema.validate(data);
};
//cart validation
const cartValidation = (data) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().required(),
    price: Joi.number().min(0).max(9999).integer().required(),
  });

  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
module.exports.cartValidation = cartValidation;
