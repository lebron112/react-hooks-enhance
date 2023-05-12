import { useEffect, useRef, useState } from "react";

type TUsePageCurrentActionRes<T, ST> = {
  searchInfo: ST;
  pageInfo: TPageParmas;
  data: T[];
  total: number;
  loading: boolean;
  change: (page: number, pageSize?: number) => void;
  setSearch: (v: ST, isToPage1?: boolean) => void;
  ref: {
    current: {
      searchInfo: ST;
      pageInfo: TPageParmas;
      data: T[];
      total: number;
      loading: boolean;
    }
  }
};
// type TPageInfo = { current: number; pageSize: number };

export interface IPageData<T> {
  data: T[];
  totalPages: number;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  havePrePage: boolean;
  haveNextPage: boolean;
}

export type IResponse<T> = Promise<{
  code: number;
  data: T;
  success: boolean;
  msg?: string;
}>;

export type TPageParmas = {
  pageIndex: number;
  pageSize: number;
};

/**
 * 
 * @param param0 
 * @param action 
 * @param hide 
 * @returns 
 */
export const usePageCurrentAction = <T extends Record<string, any>, ST extends Record<string, any>>(
  { pageIndex = 1, pageSize = 10 },
  action: (params: TPageParmas & ST) => IResponse<IPageData<T>>,
  delay = false,
): TUsePageCurrentActionRes<T, ST> => {

  const [pageInfo, setPageInfo] = useState<TPageParmas>({ pageIndex, pageSize });
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInfo, setSerachInfo] = useState<ST>({} as ST);
  const isPageRef = useRef(true);
  const hasSearch = useRef(false);
  const delayRef = useRef(delay);

  useEffect(() => {
    delayRef.current = delay;
  }, []);

  const ref = useRef<{
    searchInfo: ST;
    pageInfo: TPageParmas;
    data: T[];
    total: number;
    loading: boolean;
  }>({
    searchInfo: {} as ST,
    pageInfo: { pageIndex: 1, pageSize: 10 },
    data: [],
    loading: false,
    total: 0,
  });
  const change = (index: number, size?: number) => {
    !delayRef.current && setPageInfo({ pageIndex: index, pageSize: size || pageSize });
  };

  useEffect(() => {
    loadAction();
    ref.current.pageInfo = pageInfo;
  }, [pageInfo]);

  useEffect(() => {
    if ((searchInfo && Object.keys(searchInfo).length) || hasSearch.current) {
      if (isPageRef.current) {
        change(pageIndex, pageSize);
      } else {
        const { pageIndex, pageSize } = pageInfo;
        change(pageIndex, pageSize);
      }
    }
    ref.current.searchInfo = searchInfo;
  }, [searchInfo]);

  const loadAction = () => {
    setLoading(true);
    const { pageIndex, pageSize } = pageInfo;
    action({ pageIndex, pageSize, ...searchInfo }).then(res => {
      const { totalRecords, data } = res.data;
      setTotal(totalRecords);
      setData(data);
      setLoading(false);
      ref.current.data = data;
      ref.current.total = total;
      ref.current.loading = loading;
      return res;
    }).catch(err => {
      setLoading(false);
      ref.current.loading = loading;
      throw err;
    });
  };

  const setSearch = (searchInfo: ST, isToPage1 = true) => {
    isPageRef.current = isToPage1;
    hasSearch.current = true;
    delayRef.current = false;
    setSerachInfo({ ...searchInfo });
  };

  return {
    searchInfo, pageInfo, data, total, loading,
    change, setSearch, ref,
  };
};