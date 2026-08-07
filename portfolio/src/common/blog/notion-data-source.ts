import type { Client } from "@notionhq/client";

type DataSourceQueryParams = Parameters<Client["dataSources"]["query"]>[0];
type DataSourceQueryResponse = Awaited<
  ReturnType<Client["dataSources"]["query"]>
>;

const dataSourceIdCache = new Map<string, string>();

export async function resolveDataSourceId(
  client: Client,
  databaseId: string,
): Promise<string> {
  const envDataSourceId = process.env.NOTION_DATA_SOURCE_ID;
  if (envDataSourceId) return envDataSourceId;

  const cached = dataSourceIdCache.get(databaseId);
  if (cached) return cached;

  const database = await client.databases.retrieve({ database_id: databaseId });
  if (!("data_sources" in database) || !database.data_sources?.length) {
    throw new Error(`No data source found for Notion database ${databaseId}`);
  }

  if (database.data_sources.length > 1) {
    throw new Error(
      `Multiple data sources found for Notion database ${databaseId}. Set NOTION_DATA_SOURCE_ID explicitly.`,
    );
  }

  const dataSourceId = database.data_sources[0].id;
  dataSourceIdCache.set(databaseId, dataSourceId);
  return dataSourceId;
}

export async function queryAllDataSourcePages(
  client: Client,
  databaseId: string,
  config: {
    filter?: DataSourceQueryParams["filter"];
    sorts?: DataSourceQueryParams["sorts"];
    pageSize?: number;
  } = {},
): Promise<DataSourceQueryResponse["results"]> {
  const dataSourceId = await resolveDataSourceId(client, databaseId);
  const results: DataSourceQueryResponse["results"] = [];
  let cursor: string | undefined;

  do {
    const response = await client.dataSources.query({
      data_source_id: dataSourceId,
      ...(config.filter ? { filter: config.filter } : {}),
      sorts: config.sorts ?? [
        { timestamp: "created_time", direction: "descending" },
      ],
      page_size: config.pageSize || 100,
      start_cursor: cursor,
    });

    results.push(...response.results);
    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return results;
}
