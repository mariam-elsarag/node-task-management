import React, { useState } from "react";
import Page_Header from "../../components/ui/header/Page_Header";
import Button from "../../components/ui/button/Button";
import usePaginatedData from "../../hooks/usePaginatedData";
import Table_Container from "../../components/table/Table_Container";
import Badge from "../../components/ui/badge/Badge";
import Action from "../../components/table/Action";
import Menu from "../../components/table/Menu";
import { EyeOn, PenWithSquareIcon, TrashIcon } from "../../assets/icons/Icon";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../servicses/axiosInstance";
import { toast } from "react-toastify";
import { handleError } from "../../utils/handleErrors";
import Confirmation from "../../components/modal/Confirmation";

const columns = [
  { field: "name", header: "Project" },
  { field: "status", header: "Status" },
  { field: "progress", header: "Progress" },
  { field: "start_date", header: "Start Date" },
  { field: "end_date", header: "End Date" },
  { field: "action", header: "" },
];
const Project = () => {
  const navigate = useNavigate();
  const {
    data,
    query,
    setQuery,
    handlePagination,
    page,
    pages,
    loading,
    setRefetchData,
  } = usePaginatedData("/api/project");
  // for delete project
  const [visibility, setVisibility] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [id, setId] = useState();
  const handleDelete = async () => {
    try {
      setDeleteLoader(true);
      const response = await axiosInstance.delete(`/api/project/${id}`);
      if (response.status === 204) {
        toast.success("Successfully delete project");
        setVisibility(false);
        setRefetchData(new Date());
      }
    } catch (err) {
      handleError(err);
    } finally {
      setDeleteLoader(false);
    }
  };

  const menuList = [
    {
      icon: <EyeOn />,
      title: "View",
      action: (data) => navigate(`/project/${data.projectId}/details`),
    },
    {
      icon: <PenWithSquareIcon />,
      title: "Edit",
      action: (data) => navigate(`/project/${data.projectId}/edit`),
    },
    {
      icon: <TrashIcon fill="var(--color-error-800)" />,
      title: "Delete",
      className: "!text-error-800",
      action: (data) => {
        setVisibility(true);
        setId(data?.projectId);
      },
    },
  ];
  const badgeType = (status: string): { text: string; type: string } => {
    switch (status) {
      case "planned":
        return { text: "planned", type: "pending" };
      case "in_progress":
        return { text: "in progress", type: "purple" };
      case "completed":
        return { text: "Compledted", type: "done" };
      case "on_hold":
        return { text: "On hold", type: "hold" };
      case "delayed":
        return { text: "Delayed", type: "error" };
      default:
        return { text: "planned", type: "pending" };
    }
  };
  const getProgressColor = (progress: number = 0): string => {
    if (progress < 30) return "bg-error-800";
    if (progress < 70) return "bg-amber-400";
    return "bg-emerald-600";
  };
  const formatData = data?.map((item, index) => {
    const { text, type } = badgeType(item.status);

    return {
      name: (
        <div className="flex items-center gap-2">
          {item?.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
          <span className="capitalize font-semibold">{item.name}</span>
        </div>
      ),
      status: <Badge text={text} type={type} />,
      progress: (
        <div className="flex_center_y gap-1 w-full">
          <div className="bg-gray-100 w-[100px] rounded-full h-2.5">
            <div
              className={`${getProgressColor(
                item.progress
              )} h-2.5 rounded-full`}
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600">{item.progress}%</span>
        </div>
      ),
      start_date: <span>{item?.start_date}</span>,
      end_date: <span>{item?.end_date}</span>,
      action: (
        <Menu
          data={item}
          list={menuList}
          isFirstElement={index === 0}
          isLastElement={data?.length - 1 === index}
        />
      ),
    };
  });

  return (
    <>
      <div className="main_page flex flex-col gap-10 ">
        <header className="flex_center_y justify-end">
          <Button
            to="/project/create"
            hasFullWidth={false}
            className="md:min-w-[200px]"
          >
            Add Project
          </Button>
        </header>

        <Table_Container
          columns={columns}
          data={formatData}
          loading={loading}
          onPageChange={handlePagination}
          totalCount={pages}
          currentPage={page}
          query={query}
          setQuery={setQuery}
          page="project"
          searchPlaceHolder="Search with project name"
        />
      </div>
      <Confirmation
        open={visibility}
        onClose={() => {
          setVisibility(false);
        }}
        className="!w-[450px]"
        loading={deleteLoader}
        message="Are you sure you want to delete project?"
        handleClick={handleDelete}
      />
    </>
  );
};

export default Project;
