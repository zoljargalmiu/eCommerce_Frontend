import React from "react";
import ReactPaginate from "react-paginate";

function Pagination({
  current = 1,
  totalPages = 1,
  prevAction,
  nextAction,
  changeAction,
}) {
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === current) {
      pages.push(
        <li className={"page-item active"}>
          <a className="page-link" href="#">
            {i}
          </a>
        </li>
      );
    } else {
      pages.push(
        <li className={"page-item"}>
          <a className="page-link" href="#" onClick={() => changeAction(i)}>
            {i}
          </a>
        </li>
      );
    }
  }

  return totalPages <= 1 ? null : (
    <div className="mt-4">
      <ReactPaginate
        previousLabel={<i className="mdi mdi-chevron-left"></i>}
        nextLabel={<i className="mdi mdi-chevron-right"></i>}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(data) => changeAction(data.selected)}
        containerClassName={
          "pagination pagination-rounded align-items-end justify-content-center mb-0"
        }
        nextClassName={"page-item"}
        previousClassName={"page-item"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        previousLinkClassName={"page-link"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />
      {/* <ul className="pagination pagination-rounded justify-content-center mb-0">
        {current > 1 ? (
          <li className="page-item">
            <a className="page-link" href="#" onClick={() => prevAction()}>
              <i className="mdi mdi-chevron-left"></i>
            </a>
          </li>
        ) : null}
        {pages}
        {current < totalPages ? (
          <li className="page-item">
            <a className="page-link" href="#" onClick={() => nextAction()}>
              <i className="mdi mdi-chevron-right"></i>
            </a>
          </li>
        ) : null}
      </ul> */}
    </div>
  );
}

export default Pagination;
