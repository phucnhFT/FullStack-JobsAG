import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

export default function AppliedJobTable() {
  const { allAppliedJobs } = useSelector((store) => store.job);
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Danh sách công việc bạn đã ứng tuyển</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs md:text-sm">Ngày</TableHead>
            <TableHead className="text-xs md:text-sm">Vai Trò</TableHead>
            <TableHead className="text-xs md:text-sm">Công ty</TableHead>
            <TableHead className="text-right text-xs md:text-sm">
              Trạng Thái
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-xs md:text-sm">
                Bạn chưa ứng tuyển công việc nào
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell className="text-xs md:text-sm">
                  {appliedJob?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-xs md:text-sm">
                  {appliedJob.job?.title}
                </TableCell>
                <TableCell className="text-xs md:text-sm">
                  {appliedJob.job?.company?.name}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`text-xs md:text-sm ${
                      appliedJob?.status === "đã từ chối"
                        ? "bg-red-400"
                        : appliedJob.status === "đang chờ"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
