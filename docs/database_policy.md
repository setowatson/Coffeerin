
## データベース設計

### ユーザーテーブルのポリシー
```sql
alter table public.users enable row level security;

create policy "Users can view all profiles"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);
```

### コーヒー記録テーブルのポリシー
```sql
alter table public.coffee_entries enable row level security;

create policy "Anyone can view coffee entries"
  on public.coffee_entries for select
  using (true);

create policy "Users can create coffee entries"
  on public.coffee_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own coffee entries"
  on public.coffee_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own coffee entries"
  on public.coffee_entries for delete
  using (auth.uid() = user_id);
```

### いいねテーブルのポリシー
```sql
alter table public.likes enable row level security;

create policy "Anyone can view likes"
  on public.likes for select
  using (true);

create policy "Users can create likes"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.likes for delete
  using (auth.uid() = user_id);
```

### コメントテーブルのポリシー
```sql
alter table public.comments enable row level security;

create policy "Anyone can view comments"
  on public.comments for select
  using (true);

create policy "Users can create comments"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);
``` 