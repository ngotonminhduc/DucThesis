# DetailSubjectPage Refactor & Feature Documentation

## 1. Pagination cho danh sách câu hỏi
- Thêm phân trang cho danh sách câu hỏi (subject questions).
- Số lượng câu hỏi mỗi trang lấy từ `pageSize` (có thể chỉnh trong constants).
- Sử dụng component `PaginationControls` để chuyển trang.
- Khi chuyển trang, chỉ render các câu hỏi thuộc trang đó.

## 2. Tìm kiếm (search) câu hỏi
- Thêm ô input search phía trên danh sách câu hỏi.
- Khi nhập, lọc danh sách câu hỏi theo nội dung (`content`) chứa từ khoá (không phân biệt hoa thường).
- Khi search, chỉ hiển thị các câu hỏi phù hợp, nhưng mọi thao tác (thêm, sửa, xoá) đều cập nhật vào state gốc (không chỉ state đã lọc).
- Đảm bảo khi update, không bị mất dữ liệu do logic xoá hết rồi thêm lại (giữ lại state đúng).

## 3. Đảm bảo không bị rerender liên tục
- Sử dụng `useMemo` để memoize danh sách đã lọc/search và phân trang.
- Sử dụng `useCallback` cho các hàm thao tác (thêm, sửa, xoá).
- Đảm bảo các props truyền xuống component con không thay đổi không cần thiết.

## 4. Sửa lỗi xoá sai câu hỏi
- Khi render list, truyền đúng index thực tế của câu hỏi trong mảng gốc vào các handler (không phải index sau khi filter/paginate).
- Khi xoá, dùng index thực tế để xoá khỏi mảng gốc.
- Đảm bảo thao tác xoá, sửa, thêm luôn đúng với dữ liệu gốc, không bị lệch do filter/pagination.

## 5. Hướng dẫn sử dụng
- Có thể tìm kiếm câu hỏi bằng ô search phía trên.
- Có thể chuyển trang bằng nút phân trang phía dưới danh sách.
- Khi thêm/sửa/xoá câu hỏi trong trạng thái search, mọi thao tác đều cập nhật vào danh sách gốc.
- Khi nhấn "Cập nhật", toàn bộ câu hỏi và đáp án sẽ được xoá hết và tạo lại theo state hiện tại.

## 6. Lưu ý
- Đảm bảo không bị miss các tính năng cũ như thêm/sửa/xoá answer cho từng question.
- Đảm bảo không bị rerender liên tục khi thao tác search, phân trang, thêm/sửa/xoá.
- Nếu cần thay đổi số lượng câu hỏi mỗi trang, chỉnh trong file `@/utils/constants` (biến `pageSize`).

---

**Mọi thắc mắc hoặc bug liên quan đến logic mới, vui lòng liên hệ team FE.** 