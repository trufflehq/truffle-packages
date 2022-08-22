import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  React,
  useEffect,
  useMemo,
  useMutation,
  useReactTable,
  useState,
  useStyleSheet
} from "../../deps.ts";

import { useVirtual } from 'https://npm.tfl.dev/react-virtual'

import { RandomSubmissionProps } from "../admin/admin.tsx";
import ExternalLink from "../external-link/external-link.tsx";
import Pagination from '../pagination/pagination.tsx'
import stylesheet from "./submissions-list.scss.js";


import { getApproveSubmissionInput, getDeleteSubmissionInput } from "../../api/mod.ts";
import { Poll, Submission, SubmissionStatus } from "../../types/mod.ts";
import { fetchSubmissions, fetchSubmissionPage } from "../../api/mod.ts";
import { ACTION_EXECUTE_MUTATION } from "../../gql/mod.ts";
import { getHasPollEnded } from "../../utils/mod.ts";
import LoadingSpinner from '../loading-spinner/loading-spinner.tsx'
import { useInterval, usePagination } from "../../hooks/mod.ts";
import UserChip from "../user-chip/user-chip.tsx";

const SUBMISSION_REFRESH_INTERVAL = 3 * 1000;
const PAGE_SIZE = 20

function getNumPages (count: number, size: number)  {
  return Math.floor(count / size)
}

function ApproveButton({ id, onAction }: { id: string; onAction: () => void }) {
  const [result, executeSubmissionApproveMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );

  const handleClick = async () => {
    const input = getApproveSubmissionInput(id);
    await executeSubmissionApproveMutation(input);
    onAction?.();
  };

  return (
    <div className="c-row-control" onClick={handleClick}>
      {result?.fetching ? <LoadingSpinner /> : "✅"}
    </div>
  );
}

function QueueButton({ onAction }: { onAction: () => void }) {
  const handleClick = () => {
    onAction?.();
  };

  return (
    <div className="c-row-control" onClick={handleClick}>
      {"⬆️"}
    </div>
  );
}

function DeleteButton({ id, onAction }: { id: string; onAction: () => void }) {
  const [result, executeSubmissionDeleteMutation] = useMutation(
    ACTION_EXECUTE_MUTATION,
  );

  const handleClick = async () => {
    const input = getDeleteSubmissionInput(id);
    await executeSubmissionDeleteMutation(input);
    onAction?.();
  };

  return (
    <div className="c-row-control" onClick={handleClick}>
      {result?.fetching ? <LoadingSpinner /> : "❌"}
    </div>
  );
}

const columnHelper = createColumnHelper<Submission>();

type SubmissionsListProps = {
  latestPoll?: Poll;
  variant: "submissions" | "approved";
} & RandomSubmissionProps;

export default function SubmissionsList({ variant, setRandomSubmission, latestPoll }: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState([]);
  const [isInitializing, setIsInitializing] = useState(false)
  const [submissionCount, setSubmissionCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  useStyleSheet(stylesheet);
  const hasPollEnded = getHasPollEnded(latestPoll?.endTime);
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor((row) => row, {
        id: 'index',
        header: () => "Index",
        cell: (info) => {
          const offset = currentPage > 0 ? currentPage * PAGE_SIZE : currentPage
          const pageIndex = info.row.index + 1
          const index = offset + pageIndex
          return(<span>{index}</span>)
        }
      }),
      columnHelper.accessor("title", {
        cell: (info) => info.getValue(),
        header: () => "Title",
      }),
      columnHelper.accessor((row) => row, {
        id: "username",
        cell: (info) => (
          <ExternalLink
            link={`http://www.youtube.com/channel/${info.getValue()?.connectionId}`}
            text={info.getValue()?.username || info.getValue()?.channelTitle }
          />
        ),
        header: () => "User",
      }),
      columnHelper.accessor("link", {
        header: () => "Song",
        cell: (info) => <ExternalLink link={info.getValue()} text={info.getValue()} />,
      }),
      columnHelper.accessor((row) => row, {
        id: "controls",
        header: () => "Controls",
        cell: (info) => (
          <div className="row-controls">
            {variant === "submissions"
              ? <ApproveButton id={info.getValue()?.id} onAction={refreshSubmission} />
              : variant === "approved" && hasPollEnded
              ? <QueueButton onAction={() => setRandomSubmission(info.getValue())} />
              : null}
            <DeleteButton id={info.getValue()?.id} onAction={refreshSubmission} />
          </div>
        ),
      }),
    ].filter((col) => col !== null);

    return baseColumns;
  }, [JSON.stringify(submissions), hasPollEnded]);

  const table = useReactTable({
    data: submissions,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const refreshSubmission = async () => {
    const status: SubmissionStatus = variant === "submissions" ? "review" : "approved";
    // const submissions = await fetchSubmissions(status, 200);
    const submissionPage = await fetchSubmissionPage(status, currentPage, PAGE_SIZE)
    
    const submissions = submissionPage?.submissions

    const count = submissionPage?.count

    if(typeof submissions !== 'undefined') {
      setSubmissions([...submissions]);
    }

    if(typeof count !== 'undefined') {
      setSubmissionCount(count)
    }
  };

  useEffect(() => {
    const initSubmission = async () => {
      setIsInitializing(true)
      await refreshSubmission();
      setIsInitializing(false)
    }

    initSubmission()
  }, []);

  useInterval(async () => {
    await refreshSubmission();
  }, SUBMISSION_REFRESH_INTERVAL);

  const tableContainerRef = React.useRef(null)

  const { rows } = table.getRowModel()
  
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  })
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer

  const numPages = getNumPages(submissionCount || 0, PAGE_SIZE)

  const onHandlePageChange = (page: number) => {
      console.log('onHandlePageChange')
      page = page === 0 ? 0 : page - 1
      console.log('new page', page)
      setCurrentPage(page)
      refreshSubmission()
  }
  return (
    <div ref={tableContainerRef} className="c-submissions-list">
      {(
          <table>
            {submissions?.length ? <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead> : null}
            <tbody>
              { submissions?.length
        ? virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]

                return <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              }
              )
              : typeof submissions !== "undefined"
        ? isInitializing ? (<div className="empty">
          <LoadingSpinner size={100} />
        </div>
        ) : <h2>
          No Submissions
        </h2> : null
            }
            </tbody>
          </table>
        )
     }
    {
      submissionCount > 0 ? 
      <Pagination 
        onPageChange={onHandlePageChange}
        totalCount={submissionCount}
        siblingCount={2}
        pageSize={20}
        currentPage={currentPage + 1}
        className={'c-pagination'}
      /> : null
    }
    </div>
  );
}
