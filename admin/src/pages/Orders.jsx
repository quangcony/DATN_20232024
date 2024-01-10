import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { contextMenuItems, ordersGrid, projectsGrid } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Orders = () => {
  const editing = { allowDeleting: true, allowEditing: true };
  const { getCampaignsByQuery } = useStateContext();

  const [campaigns, setCampaings] = useState([])

  useEffect(() => {
    const fetchCampaignData = async () => {
      const res = await getCampaignsByQuery('status=pending');
      if (res) setCampaings(res);
    };
    fetchCampaignData();
  }, [])
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Dự án đợi xác nhận" />
      <GridComponent
        id="gridcomp"
        dataSource={campaigns}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {ordersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Orders;
