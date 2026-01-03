/**
 * 示例数据 - 用于快速体验功能
 * 包含5段SQL语句和对应的CSV数据
 */

export interface SampleSQL {
  code: string
  description: string
}

export interface SampleCSV {
  name: string
  data: string
  description: string
}

/**
 * 示例SQL数据
 * 包含5个业务表：用户、订单、订单明细、产品、产品类别
 */
export const SAMPLE_SQLS: SampleSQL[] = [
  {
    code: `-- 用户表
CREATE TABLE users (
  user_id INT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  age INT,
  city VARCHAR(50),
  register_date DATE,
  status VARCHAR(20) DEFAULT 'active'
);`,
    description: "用户基本信息表"
  },
  {
    code: `-- 产品类别表
CREATE TABLE categories (
  category_id INT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL,
  description TEXT
);`,
    description: "产品类别表"
  },
  {
    code: `-- 产品表
CREATE TABLE products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  category_id INT,
  price DECIMAL(10, 2),
  stock_quantity INT,
  created_at DATE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);`,
    description: "产品信息表"
  },
  {
    code: `-- 订单表
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  user_id INT,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address VARCHAR(200),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);`,
    description: "订单主表"
  },
  {
    code: `-- 订单明细表
CREATE TABLE order_items (
  item_id INT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  subtotal DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);`,
    description: "订单明细表"
  }
]

/**
 * 示例CSV数据
 * 对应5个表的示例数据
 */
export const SAMPLE_CSVS: SampleCSV[] = [
  {
    name: "users.csv",
    description: "用户数据",
    data: `user_id,username,email,age,city,register_date,status
1,张三,zhangsan@example.com,28,北京,2024-01-15,active
2,李四,lisi@example.com,32,上海,2024-02-20,active
3,王五,wangwu@example.com,25,广州,2024-03-10,active
4,赵六,zhaoliu@example.com,30,深圳,2024-04-05,active
5,孙七,sunqi@example.com,27,杭州,2024-05-12,active
6,周八,zhouba@example.com,35,成都,2024-06-01,active
7,吴九,wujiu@example.com,29,武汉,2024-06-15,active
8,郑十,zhengshi@example.com,31,西安,2024-07-01,active
9,钱十一,qianshiyi@example.com,26,南京,2024-07-10,active
10,陈十二,chenshier@example.com,33,重庆,2024-07-20,active`
  },
  {
    name: "categories.csv",
    description: "产品类别数据",
    data: `category_id,category_name,description
1,电子产品,手机、电脑等电子设备
2,服装,男女装、鞋子等
3,家居,家具、家居用品
4,食品,零食、饮料等
5,图书,教材、小说、杂志等`
  },
  {
    name: "products.csv",
    description: "产品数据",
    data: `product_id,product_name,category_id,price,stock_quantity,created_at
1,iPhone 15 Pro,1,7999.00,50,2024-01-01
2,MacBook Pro,1,12999.00,30,2024-01-01
3,男士T恤,2,199.00,200,2024-01-15
4,女士连衣裙,2,299.00,150,2024-01-15
5,双人床,3,2999.00,20,2024-02-01
6,沙发,3,1999.00,25,2024-02-01
7,薯片大礼包,4,39.90,500,2024-03-01
8,可乐12瓶装,4,24.00,300,2024-03-01
9,JavaScript高级程序设计,5,89.00,100,2024-01-20
10,三体全集,5,128.00,80,2024-01-20`
  },
  {
    name: "orders.csv",
    description: "订单数据",
    data: `order_id,user_id,order_date,total_amount,status,shipping_address
1,1,2024-07-01,8798.00,completed,北京市朝阳区xxx路1号
2,2,2024-07-02,299.00,completed,上海市浦东新区xxx路2号
3,3,2024-07-03,3998.00,shipped,广州市天河区xxx路3号
4,1,2024-07-05,152.00,completed,北京市朝阳区xxx路1号
5,4,2024-07-06,128.00,pending,深圳市南山区xxx路4号
6,5,2024-07-07,1999.00,completed,杭州市西湖区xxx路5号
7,2,2024-07-08,89.00,completed,上海市浦东新区xxx路2号
8,6,2024-07-10,7999.00,shipped,成都市武侯区xxx路6号
9,3,2024-07-12,24.00,completed,广州市天河区xxx路3号
10,7,2024-07-15,299.00,completed,武汉市洪山区xxx路7号`
  },
  {
    name: "order_items.csv",
    description: "订单明细数据",
    data: `item_id,order_id,product_id,quantity,unit_price,subtotal
1,1,1,1,7999.00,7999.00
2,1,10,1,799.00,799.00
3,2,3,1,199.00,199.00
4,2,10,1,100.00,100.00
5,3,5,1,2999.00,2999.00
6,3,10,1,999.00,999.00
7,4,7,2,39.90,79.80
8,4,8,3,8.00,24.00
9,5,10,1,128.00,128.00
10,6,6,1,1999.00,1999.00
11,7,9,1,89.00,89.00
12,8,1,1,7999.00,7999.00
13,9,8,1,24.00,24.00
14,10,3,1,199.00,199.00
15,10,7,2,39.90,79.80`
  }
]

/**
 * 获取示例SQL内容
 */
export function getSampleSQLCodes(): string[] {
  return SAMPLE_SQLS.map(sql => sql.code)
}

/**
 * 获取示例CSV文件列表（用于文件上传组件）
 */
export function getSampleCSVFiles(): File[] {
  return SAMPLE_CSVS.map(csv => {
    const blob = new Blob([csv.data], { type: 'text/csv' })
    return new File([blob], csv.name, { type: 'text/csv' })
  })
}

/**
 * 获取示例SQL列表（用于SQL输入组件）
 */
export function getSampleSQLList(): Array<{ code: string; description: string }> {
  return SAMPLE_SQLS.map(sql => ({
    code: sql.code,
    description: sql.description
  }))
}
