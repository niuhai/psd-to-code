// API工具函数

export interface DifferenceDetail {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: string;
  severity?: string;
  description?: string;
}

export interface Differences {
  total: number;
  details: DifferenceDetail[];
  summary?: {
    layoutIssues: number;
    contentIssues: number;
    visualIssues: number;
    score: number;
  };
}

export interface Layer {
  id: string;
  name: string;
  path: string;
  type: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  bounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
  hasMask: boolean;
  hasEffects: boolean;
  isGroup: boolean;
  parent: string;
}

export interface PSDInfo {
  width: number;
  height: number;
  layers: Layer[];
  channels: number;
  resolution: {
    width: number;
    height: number;
  };
  colorMode: string;
}

export interface Slice {
  name: string;
  path: string;
  absolutePath: string;
  format: string;
  width: number;
  height: number;
  size: number;
  bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
}

// 基础URL
const API_BASE_URL = 'http://localhost:3001/api';

// 文件上传
export const uploadFile = async (file: File): Promise<{ success: boolean; filePath: string; fileName: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

// 捕获截图
export const captureScreenshot = async (url: string, deviceType: string, screenSize: string): Promise<{ success: boolean; screenshotPath: string }> => {
  const response = await fetch(`${API_BASE_URL}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, deviceType, screenSize })
  });
  
  return response.json();
};

// 比较图片
export const compareImages = async (designPath: string, screenshotPath: string, sensitivity: number): Promise<{ success: boolean; comparisonPath: string; differences: Differences }> => {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ designPath, screenshotPath, sensitivity })
  });
  
  return response.json();
};

// 解析PSD文件
export const parsePsd = async (filePath: string): Promise<{ success: boolean; psdInfo: PSDInfo }> => {
  const response = await fetch(`${API_BASE_URL}/generate/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filePath })
  });
  
  return response.json();
};

// 生成代码
export const generateCode = async (filePath: string, framework: string, selectedLayers?: string[], assetPath?: string): Promise<{ success: boolean; code: string; componentCount?: number; elementCount?: number }> => {
  const response = await fetch(`${API_BASE_URL}/generate/code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filePath, framework, layers: selectedLayers, assetPath: assetPath })
  });
  
  return response.json();
};

// 生成切图
export const generateSlices = async (filePath: string, options?: any): Promise<{ success: boolean; slices: Slice[]; totalSlices: number }> => {
  const response = await fetch(`${API_BASE_URL}/slice/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filePath, options })
  });
  
  return response.json();
};

// 批量生成切图
export const batchGenerateSlices = async (filePaths: string[], options?: any): Promise<{ success: boolean; results: any[] }> => {
  const response = await fetch(`${API_BASE_URL}/slice/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filePaths, options })
  });
  
  return response.json();
};

// 清理切片文件
export const cleanupSlices = async (): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/slice/cleanup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  return response.json();
};

// 获取切片信息
export const getSliceInfo = async (slicePath: string): Promise<{ success: boolean; info: any }> => {
  const response = await fetch(`${API_BASE_URL}/slice/info?slicePath=${encodeURIComponent(slicePath)}`);
  
  return response.json();
};

// 获取图层列表
export const getLayers = async (filePath: string): Promise<{ success: boolean; layers: any[]; error?: string }> => {
  const response = await fetch(`${API_BASE_URL}/generate/layers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ filePath })
  });
  
  return response.json();
};