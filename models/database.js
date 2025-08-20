const { Sequelize, DataTypes } = require('sequelize');

// 환경변수 로드 확인
console.log('🔍 데이터베이스 연결 설정:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

// 로컬 MySQL 연결 설정
const sequelize = new Sequelize(
  process.env.DB_NAME || 'community_db',
  process.env.DB_USER || 'appuser',
  process.env.DB_PASSWORD || 'apppass123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: console.log, // SQL 쿼리 로그 출력
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// 사용자 모델
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'Lv.1'
  }
}, {
  tableName: 'users',
  timestamps: true
});

// 게시글 모델
const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  boardId: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: '일반'
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authorLevel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  likedBy: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'posts',
  timestamps: true,
  indexes: [
    {
      fields: ['boardId']
    },
    {
      fields: ['authorId']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// 댓글 모델
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Post,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authorLevel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'comments',
  timestamps: true,
  indexes: [
    {
      fields: ['postId']
    },
    {
      fields: ['authorId']
    }
  ]
});

// 관광지 모델 (한국관광공사 API 데이터)
const TouristSpot = sequelize.define('TouristSpot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    index: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addr1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addr2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  areaCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cat1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cat2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cat3: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contentTypeId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstImage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  firstImage2: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mapX: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  mapY: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  modifiedTime: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'tourist_spots',
  timestamps: true,
  indexes: [
    {
      fields: ['contentId']
    },
    {
      fields: ['areaCode']
    },
    {
      fields: ['contentTypeId']
    },
    {
      fields: ['mapX', 'mapY']
    }
  ]
});

// 관계 설정
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'user' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL 데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error);
    return false;
  }
};

// 테이블 생성/동기화
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ 데이터베이스 테이블 동기화 완료');
    return true;
  } catch (error) {
    console.error('❌ 데이터베이스 테이블 동기화 실패:', error);
    return false;
  }
};

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  TouristSpot,
  testConnection,
  syncDatabase
};