import { Box, Grid } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'

export default function ScrollableCards<T>(props: {
  loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
  mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
  skeletonMap: (_: any, index: number) => React.JSX.Element
}) {
  // 1) Start with 12 skeleton items (each a <Grid item>)
  const initial = [...Array(12)].map((_, i) => (
    <Grid item xs={12} sm={6} md={6} lg={4} key={`skeleton-${i}`}>
      {props.skeletonMap(_, i)}
    </Grid>
  ));
  const [cards, setCards] = useState<React.JSX.Element[]>(initial);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const deleteItem = useCallback((id: string) => {
    setCards((prev) => {
      const i = prev.findIndex((card) => card.key === id);
      if (i !== -1) {
        const newCards = [...prev];
        newCards.splice(i, 1);
        return newCards;
      }
      return prev;
    });
  }, []);

  const loadBanners = useCallback(async () => {
    const response = await props.loadMore({ page, pageSize: 12 });
    if (!response) return;

    // 2) Remove skeletons on first load
    if (page === 0) {
      setCards([]);
    }

    // 3) Increment page locally
    setPage((prevPage) => prevPage + 1);

    // 4) Check if there's another page
    setHasMore(response.pageNumber + 1 < response.maxPageNumber);

    // 5) Convert each item to a <Grid item>
    const newElements = response.content.map((value, index) => {
      const cardElement = props.mapCard(value, deleteItem);
      const key = cardElement.key ?? (value as any).id ?? `item-${index}`;

      return (
        <Grid item xs={12} sm={6} md={6} lg={4} key={key}>
          {cardElement}
        </Grid>
      );
    });

    setCards((prev) => [...prev, ...newElements]);
  }, [page, props, deleteItem]);

  useEffect(() => {
    if (page === 0) {
      loadBanners().catch(console.error);
    }
  }, [page, loadBanners]);

  const loadMore = () => {
    loadBanners().catch(console.error);
  };

  return (
    <InfiniteScroll
      dataLength={cards.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center', marginTop: 32 }}>
          <b>There are no more items available...</b>
        </p>
      }
      style={{ width: '100%', overflow: 'visible' }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'flex-start',
          p:2
        }}
      >
        {cards}
      </Grid>
    </InfiniteScroll>
  );
}
