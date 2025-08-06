require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 프론트엔드 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../front/build')));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB 제한
  }
});

// 경복궁 건물 데이터 (테스트용)
const gyeongbokgungBuildings = {
  // 경회루 (연못 위의 누각)
  gyeonghoeru: {
    id: 'gyeonghoeru',
    name: '경회루',
    nameEn: 'Gyeonghoeru Pavilion',
    description: '경복궁의 대표적인 누각으로, 연못 위에 세워진 아름다운 건물입니다.',
    detailedDescription: '경회루는 조선 태종 12년(1412)에 창건되어 임진왜란 때 소실된 후 고종 4년(1867)에 중건된 2층 누각입니다. 국왕이 신하들과 연회를 베풀거나 외국 사신을 접대하던 곳으로, 경복궁에서 가장 아름다운 건물 중 하나로 꼽힙니다.',
    coordinates: {
      lat: 37.5788,
      lng: 126.9770
    },
    area: {
      // 경회루 주변 50m 반경
      center: { lat: 37.5788, lng: 126.9770 },
      radius: 50
    },
    images: ['/image/gyeonghoeru1.jpg', '/image/gyeonghoeru2.jpg'],
    buildYear: '1412년 (태종 12년)',
    culturalProperty: '국보 제224호',
    features: ['2층 누각', '연못 위 건물', '왕실 연회장']
  },

  // 근정전 (정전)
  geunjeongjeon: {
    id: 'geunjeongjeon',
    name: '근정전',
    nameEn: 'Geunjeongjeon Hall',
    description: '경복궁의 정전으로, 조선 왕조의 공식적인 국가 행사가 열리던 곳입니다.',
    detailedDescription: '근정전은 경복궁의 중심 건물로, 조선시대 왕이 신하들의 조회를 받거나 국가의 중요한 행사를 치르던 정전입니다. 현재의 건물은 고종 때 중건된 것으로, 조선 왕조의 권위와 위엄을 상징하는 대표적인 건축물입니다.',
    coordinates: {
      lat: 37.5796,
      lng: 126.9770
    },
    area: {
      center: { lat: 37.5796, lng: 126.9770 },
      radius: 60
    },
    images: ['/image/geunjeongjeon1.jpg', '/image/geunjeongjeon2.jpg'],
    buildYear: '1395년 (태조 4년)',
    culturalProperty: '국보 제223호',
    features: ['정전', '왕의 집무실', '국가 행사장']
  },

  // 경성전 (편전)
  gyeongseungjeon: {
    id: 'gyeongseungjeon',
    name: '경성전',
    nameEn: 'Gyeongseungjeon Hall',
    description: '왕이 일상적인 정무를 보던 편전 건물입니다.',
    detailedDescription: '경성전은 근정전 북쪽에 위치한 편전으로, 왕이 평상시 정무를 처리하던 공간입니다. 근정전보다 작고 실용적인 구조로 되어 있어 일상적인 업무에 적합했습니다.',
    coordinates: {
      lat: 37.5794,
      lng: 126.9768
    },
    area: {
      center: { lat: 37.5794, lng: 126.9768 },
      radius: 40
    },
    images: ['/image/gyeongseungjeon1.jpg'],
    buildYear: '1395년 (태조 4년)',
    culturalProperty: '보물',
    features: ['편전', '일상 정무', '실무 공간']
  },

  // 사정전 (편전)
  sajeongjeon: {
    id: 'sajeongjeon',
    name: '사정전',
    nameEn: 'Sajeongjeon Hall',
    description: '왕이 일상적인 정무를 보던 편전으로, 근정전보다 작고 실용적인 건물입니다.',
    detailedDescription: '사정전은 왕이 평상시 정무를 보던 편전으로, 근정전이 공식적인 국가 행사를 위한 공간이라면 사정전은 일상적인 업무를 처리하던 실무 공간이었습니다.',
    coordinates: {
      lat: 37.5801,
      lng: 126.9770
    },
    area: {
      center: { lat: 37.5801, lng: 126.9770 },
      radius: 40
    },
    images: ['/image/sajeongjeon1.jpg'],
    buildYear: '1395년 (태조 4년)',
    culturalProperty: '보물 제1759호',
    features: ['편전', '일상 정무', '실무 공간']
  },

  // 강녕전 (왕의 침전)
  gangnyeongjeon: {
    id: 'gangnyeongjeon',
    name: '강녕전',
    nameEn: 'Gangnyeongjeon Hall',
    description: '조선시대 왕의 침전으로 사용된 건물입니다.',
    detailedDescription: '강녕전은 조선시대 왕이 거처하던 침전으로, 왕의 사적인 생활 공간이었습니다. 현재의 건물은 고종 때 중건된 것입니다.',
    coordinates: {
      lat: 37.5804,
      lng: 126.9775
    },
    area: {
      center: { lat: 37.5804, lng: 126.9775 },
      radius: 35
    },
    images: ['/image/gangnyeongjeon1.jpg'],
    buildYear: '1395년 (태조 4년)',
    culturalProperty: '보물 제1760호',
    features: ['왕의 침전', '사적 공간', '생활 공간']
  },

  // 교태전 (왕비의 침전)
  gyotaejeon: {
    id: 'gyotaejeon',
    name: '교태전',
    nameEn: 'Gyotaejeon Hall',
    description: '조선시대 왕비의 침전으로 사용된 건물입니다.',
    detailedDescription: '교태전은 조선시대 왕비가 거처하던 침전으로, 왕비의 사적인 생활 공간이었습니다. 아름다운 꽃담으로도 유명합니다.',
    coordinates: {
      lat: 37.5807,
      lng: 126.9775
    },
    area: {
      center: { lat: 37.5807, lng: 126.9775 },
      radius: 35
    },
    images: ['/image/gyotaejeon1.jpg'],
    buildYear: '1395년 (태조 4년)',
    culturalProperty: '보물 제1761호',
    features: ['왕비의 침전', '꽃담', '여성 공간']
  }
};

// 두 좌표 간의 거리 계산 (미터 단위)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// 위치 기반 건물 식별 (가장 가까운 건물 반환)
function identifyBuildingByLocation(lat, lng) {
  console.log(`위치 분석: ${lat}, ${lng}`);

  let closestBuilding = null;
  let closestDistance = Infinity;

  // 모든 건물과의 거리 계산
  for (const [, building] of Object.entries(gyeongbokgungBuildings)) {
    const distance = calculateDistance(lat, lng, building.area.center.lat, building.area.center.lng);
    console.log(`${building.name}까지의 거리: ${Math.round(distance)}m`);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestBuilding = building;
    }
  }

  if (closestBuilding) {
    console.log(`가장 가까운 건물: ${closestBuilding.name} (${Math.round(closestDistance)}m)`);
    return {
      ...closestBuilding,
      distance: Math.round(closestDistance)
    };
  }

  console.log('건물을 찾을 수 없습니다.');
  return null;
}

// 경복궁 영역 확인
function isInGyeongbokgung(lat, lng) {
  // 경복궁 대략적인 경계 (사각형 영역)
  const bounds = {
    north: 37.5820,
    south: 37.5760,
    east: 126.9790,
    west: 126.9750
  };

  return lat >= bounds.south && lat <= bounds.north &&
    lng >= bounds.west && lng <= bounds.east;
}

// 간단한 주소 생성 (프론트엔드에서 실제 주소 조회)
function getAddressFromCoordinates(isInside, buildingName) {
  if (isInside) {
    return '서울특별시 종로구 사직로 161 (경복궁)';
  }

  // 프론트엔드에서 실제 주소로 대체될 플레이스홀더
  return `현재 위치 (${buildingName} 인근)`;
}

// API 라우트들

// 위치 확인 API
app.post('/api/check-location', (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: '위도와 경도가 필요합니다.'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // 가장 가까운 건물 식별 (위치 제한 없음)
    const building = identifyBuildingByLocation(lat, lng);
    const isInside = isInGyeongbokgung(lat, lng);

    if (building) {
      const locationMessage = isInside
        ? `📍 ${building.name} (${building.distance}m) - 촬영 가능`
        : `📍 ${building.name} (${building.distance}m) - 경복궁 밖에서 촬영`;

      return res.json({
        success: true,
        message: locationMessage,
        inGyeongbokgung: isInside,
        nearBuilding: true,
        building: {
          id: building.id,
          name: building.name,
          nameEn: building.nameEn,
          distance: building.distance
        }
      });
    } else {
      return res.json({
        success: true,
        message: '위치를 확인할 수 없습니다.',
        inGyeongbokgung: isInside,
        nearBuilding: false
      });
    }

  } catch (error) {
    console.error('위치 확인 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 사진 분석 API
app.post('/api/analyze-photo', upload.single('photo'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '사진이 업로드되지 않았습니다.'
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: '위치 정보가 필요합니다.'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    console.log(`사진 분석 요청: ${req.file.filename}, 위치: ${lat}, ${lng}`);

    // 위치 기반 건물 식별 (위치 제한 없음)
    const building = identifyBuildingByLocation(lat, lng);
    const isInside = isInGyeongbokgung(lat, lng);

    if (building) {
      // 좌표 기반 실제 주소 추정
      const actualAddress = getAddressFromCoordinates(isInside, building.name);

      return res.json({
        success: true,
        message: `${building.name}을(를) 식별했습니다!`,
        building: building,
        photoUrl: `/uploads/${req.file.filename}`,
        analysisResult: {
          confidence: 0.95, // 신뢰도 (테스트용)
          detectedFeatures: building.features,
          location: {
            latitude: lat,
            longitude: lng,
            accuracy: 'high',
            address: actualAddress,
            capturedAt: new Date().toISOString(),
            distanceToBuilding: building.distance,
            isInGyeongbokgung: isInside
          }
        }
      });
    } else {
      return res.json({
        success: false,
        message: '건물을 식별할 수 없습니다.',
        photoUrl: `/uploads/${req.file.filename}`,
        inGyeongbokgung: isInside
      });
    }

  } catch (error) {
    console.error('사진 분석 오류:', error);
    res.status(500).json({
      success: false,
      message: '사진 분석 중 오류가 발생했습니다.'
    });
  }
});

// 건물 정보 조회 API
app.get('/api/building/:id', (req, res) => {
  try {
    const buildingId = req.params.id;
    const building = gyeongbokgungBuildings[buildingId];

    if (!building) {
      return res.status(404).json({
        success: false,
        message: '건물 정보를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      building: building
    });

  } catch (error) {
    console.error('건물 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 모든 건물 목록 조회 API
app.get('/api/buildings', (req, res) => {
  try {
    const buildingList = Object.values(gyeongbokgungBuildings).map(building => ({
      id: building.id,
      name: building.name,
      nameEn: building.nameEn,
      description: building.description,
      coordinates: building.coordinates,
      culturalProperty: building.culturalProperty
    }));

    res.json({
      success: true,
      buildings: buildingList,
      total: buildingList.length
    });

  } catch (error) {
    console.error('건물 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// React 라우터를 위한 catch-all 핸들러 (API 라우트 이후에 배치)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front/build', 'index.html'));
});

// uploads 폴더 생성
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 서버 시작
app.listen(PORT, () => {
  console.log(`경복궁 건물 인식 API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트:`);
  console.log(`- POST /api/check-location : 위치 확인`);
  console.log(`- POST /api/analyze-photo : 사진 분석`);
  console.log(`- GET /api/building/:id : 건물 정보 조회`);
  console.log(`- GET /api/buildings : 모든 건물 목록`);
});