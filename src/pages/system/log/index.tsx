import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Badge, Tag } from 'antd';
import React, { useRef } from 'react';
import { useIntl } from '@umijs/max';
import { getSystemLogs } from '@/services/ant-design-pro/api';

type SystemLogItem = {
  id?: number;
  module?: string;
  action?: string;
  adminName?: string;
  ip?: string;
  status?: number;
  createdAt?: string;
};

const statusMap: Record<number, { text: string; status: string }> = {
  1: {
    text: '成功',
    status: 'success',
  },
  0: {
    text: '失败',
    status: 'error',
  },
};

const LogListPage: React.FC = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const intl = useIntl();

  const columns: ProColumns<SystemLogItem>[] = [
    {
      title: intl.formatMessage({ id: 'pages.system.log.module', defaultMessage: '模块名称' }),
      dataIndex: 'module',
      tooltip: '操作所属模块',
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.log.action', defaultMessage: '操作类型' }),
      dataIndex: 'action',
      width: 140,
      render: (_, record) => {
        const color = record.action === '删除' ? 'red' : record.action === '更新' ? 'orange' : 'green';
        return <Tag color={color}>{record.action}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.log.adminName', defaultMessage: '操作人' }),
      dataIndex: 'adminName',
      width: 140,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.log.ip', defaultMessage: 'IP 地址' }),
      dataIndex: 'ip',
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'pages.system.log.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      width: 120,
      render: (_, record) => {
        const item = statusMap[record.status as number] || {
          text: '未知',
          status: 'default',
        };
        return <Badge status={item.status as any} text={item.text} />;
      },
      valueEnum: {
        1: { text: '成功', status: 'Success' },
        0: { text: '失败', status: 'Error' },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.system.log.createdAt', defaultMessage: '操作时间' }),
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      width: 200,
    },
  ];

  return (
    <PageContainer>
      <ProTable<SystemLogItem, API.PageParams & { module?: string; action?: string; status?: number }>
        headerTitle={intl.formatMessage({
          id: 'pages.system.log.title',
          defaultMessage: '操作日志',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={async (params) => {
          const response = await getSystemLogs({
            current: params.current,
            pageSize: params.pageSize,
            module: params.module as string,
            action: params.action as string,
            status: params.status as number,
          });
          return {
            data: response.data || [],
            total: response.total || 0,
            success: response.success || false,
          };
        }}
        columns={columns}
        pagination={{
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  );
};

export default LogListPage;
