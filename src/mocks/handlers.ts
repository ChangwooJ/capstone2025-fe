import { http, HttpResponse } from "msw";
import priceDummyData from "./dummyData";

export const handlers = [
  http.get('http://localhost:8000/api/price', () => {
    return HttpResponse.json(priceDummyData);
  })
];