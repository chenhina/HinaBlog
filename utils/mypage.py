from math import ceil


class Pagination:

    def __init__(self, request, data_length, per_num=10, max_show=11):
        try:
            page = int(request.GET.get('page'))
            if page <= 0:
                page = 1
        except Exception:
            page = 1

        # 每页显示的数据条数
        # per_num = 10

        qd = request.GET.copy()

        # 总的页码数
        total_num = ceil(data_length / per_num)

        # 要显示的页码数
        # max_show = 11
        half_show = max_show // 2
        if total_num <= max_show:
            # 页码的起始值
            page_start = 1
            # 页码的终止值
            page_end = total_num
        else:
            # 处理左边的极值
            if page - half_show <= 0:
                page_start = 1
                page_end = max_show
            elif page + half_show > total_num:
                page_start = total_num - max_show + 1
                page_end = total_num
            else:
                page_start = page - half_show
                page_end = page + half_show

        page_list = ['<nav aria-label="Page navigation"><ul class="pagination">']

        # 上一页页面防止出现0、负页数
        if page == 1:
            page_list.append(
                f'<li class="disabled"><a><span aria-hidden="true">&laquo;</span></a></li>')
        else:
            qd['page'] = page - 1
            page_list.append(f'<li><a href="?{qd.urlencode()}"><span aria-hidden="true">&laquo;</span></a></li>')

        # 中间正常页面
        for num in range(page_start, page_end + 1):
            qd['page'] = num
            if page == num:
                page_list.append(
                    f'<li class="active"><a style="background-color: #0de2ec;border-color: #0de2ec;" href="?{qd.urlencode()}">{num}</a></li>')
            else:
                page_list.append(f'<li><a href="?{qd.urlencode()}">{num}</a></li>')

        # 下一页页面防止超过最大页数

        if page == total_num or total_num == 0:

            page_list.append(f'<li class="disabled"><a><span aria-hidden="true">&raquo;</span></a></li>')
        else:
            qd['page'] = page + 1
            page_list.append(
                f'<li><a href="?{qd.urlencode()}"><span aria-hidden="true">&raquo;</span></a></li>')

        page_list.append('</ul></nav>')

        self.page_html = ''.join(page_list)
        # 切片的起始值
        self.start = (page - 1) * per_num
        # 切片的终止值
        self.end = page * per_num
