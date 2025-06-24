import axios from "axios";
import { LoginFormType, SignUpFormType } from "../types/authType";

const BASE_URL = "https://nexbit.p-e.kr";

interface UpbitAsset {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  unit_currency: string;
}

interface AssetResponse {
  assets: UpbitAsset[];
  btc_current_price: number;
}

// 회원가입 api
export const postSignUp = async ({ form }: { form: SignUpFormType }): Promise<string | void> => {
  try {
    await axios.post(`${BASE_URL}/user/signup`, {
      email: form.email,
      password: form.password,
      username: form.username,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.message || "회원가입에 실패했습니다.";
    } else if (err instanceof Error) {
      return err.message;
    } else {
      return "알 수 없는 오류가 발생했습니다.";
    }
  }
};

// 로그인 api 
export const postLogin = async ({ form }: { form: LoginFormType }): Promise<string | { token: string }> => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email: form.email,
      password: form.password,
    });
    return { token: response.data.token };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.message || "로그인에 실패했습니다.";
    } else if (err instanceof Error) {
      return err.message;
    } else {
      return "알 수 없는 오류가 발생했습니다.";
    }
  }
};

// 유저 정보 api
export const getUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.user;
  } catch (error) {
    console.error("유저 정보 불러오기 실패:", error);
  }
}

// 유저 투자 정보 api
export const getUserAsset = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/mywallet`);
    return response.data;
  } catch (error) {
    console.error("업비트 자산 불러오기 실패:", error);
  }
}

export const getUserAccount = async () => {
  try {
    const response = await axios.get<AssetResponse>(`${BASE_URL}/user/myasset`);
    return response.data;
  } catch (error: any) {
    console.error("업비트 자산 불러오기 실패:", error.response?.data || error.message);
  }
}