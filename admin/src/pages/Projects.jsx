import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { contextMenuItems, projectsGrid } from '../data/dummy';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

const Projects = () => {
  const editing = { allowDeleting: true, allowEditing: true };
  const { getAllCampaign } = useStateContext();

  const [campaigns, setCampaings] = useState([])

  useEffect(() => {
    const fetchCampaignData = async () => {
      
      const res = await getAllCampaign();
      if (res) setCampaings(res);
    };
    fetchCampaignData();
  }, [])

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Tất cả dự án" />
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
          {projectsGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default Projects;
