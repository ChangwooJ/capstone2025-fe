import axios from "axios";

const BASE_URL = "https://nexbit.p-e.kr";

interface TradeLogsProps {
    token: string, 
    selectedType: string, 
    startDate: string | undefined,
    endDate:  string | undefined
}

interface PredictionResponse {
    success: boolean;
    predicted_price: number;
}

interface PredictionProbabilityResponse {
    up_probability: number;
}

interface OrderTypeProp {
    token: string,
    type: string | undefined,
    numPrice: number | undefined,
    quantity: number | undefined
}

export const getChartPrice = async (
  interval: string,
  count: number,
  market: string = "KRW-BTC"
) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/exchangePrice`, {
      params: {
        interval,
        count,
        market,
      },
    });

    return res.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "비트코인 시세 요청 실패";
    throw new Error(`API 요청 실패: ${message}`);
  }
}

export const getTradeLogs = async ({token, selectedType, startDate, endDate}: TradeLogsProps) => {
    try {
        const response = await axios.get(`${BASE_URL}/user/mytradelogs`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            side: selectedType === '매수' ? 'bid' : selectedType === '매도' ? 'ask' : undefined,
            state: selectedType === '전체' ? undefined : 'done',
            start_date: startDate,
            end_date: endDate,
            page: 1,
            limit: 20,
            order_by: 'desc'
          }
        });
  
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          console.error("백엔드 응답 형식이 예상과 다릅니다:", response.data);
        }
      } catch (error: any) {
        console.error("거래 로그 불러오기 실패:", error.response?.data || error.message);
      }
}

export const getPredictedPrice = async () => {
    try {
      const response = await axios.get<PredictionResponse>(`${BASE_URL}/api/predict_price`);
      if (response.data.success) {
        return response;
      }
    } catch (error) {
      console.error('예측 가격을 가져오는데 실패했습니다:', error);
    }
}

export const getPredictedProbability = async () => {
    try {
        const response = await axios.get<PredictionProbabilityResponse>(`${BASE_URL}/api/predict_probabtility`);
        if (response.data) {
            return response;
        }
    } catch (error) {
        console.error('예측 확률을 가져오는데 실패했습니다:', error);
    }
}

export const postOrder = async ({ token, type, numPrice, quantity }: OrderTypeProp) => {
    try {
        const response = await axios.post(
          `${BASE_URL}/api/order`,
          {
            market: "KRW-BTC",
            side: type === "buy" ? "bid" : "ask",
            price: numPrice!.toFixed(0),
            volume: quantity!.toFixed(8),
            ord_type: "limit"
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        );
  
        return response;
    } catch (error: any) {
        console.error("거래 실행 중 오류가 발생했습니다.");
    }
}

export const getAiStatus = async (token: string) => {
    try {
        const response = await axios.get(
          `${BASE_URL}/user/ai/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response;
      } catch (error: any) {
        console.error("AI 거래 상태 확인 중 오류가 발생했습니다.");
      }
}

export const postActiveStatus = async (isActive: boolean, token: string) => {
    try {
        const endpoint = isActive ? `${BASE_URL}/user/ai/stop` : `${BASE_URL}/user/ai/start`;
        const response = await axios.post(
          endpoint,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
            return response;
        }
      } catch (error: any) {
        console.error("AI 거래 상태 변경 중 오류가 발생했습니다.");
      }
}