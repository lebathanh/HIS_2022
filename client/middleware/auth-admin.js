export default function ({ $auth, redirect }) {
  if (!$auth.user.isSuper) {
    return redirect('/')
  }
}
