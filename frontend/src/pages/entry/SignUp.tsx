import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicPageWrapper } from "../../wrappers/PublicPageWrapper";
import { useToast } from "../../wrappers/ToastProvider";
import { registerUser } from "../../api/user";
import { LOGIN } from "../../libs/routes";
import { UserRoleEnum } from "../../types/user";
import { CodeLearnerLogo } from "../../libs/logo";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();
  const { displayToast, ToastType } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === "") {
      displayToast("No user role selected", ToastType.ERROR);
      return;
    }

    //map the role to UserRoleEnum
    let userRoleEnum = UserRoleEnum.TEACHER; // default role is teacher
    if (selectedRole! in UserRoleEnum) {
      userRoleEnum = UserRoleEnum[selectedRole as keyof typeof UserRoleEnum];
    }

    if (password !== confirmPassword) {
      displayToast("Password do not match", ToastType.ERROR);
      return;
    }
    try {
      await registerUser({ name, email, password, role: userRoleEnum! });
      displayToast("Account created!", ToastType.SUCCESS);
      navigate(LOGIN);
    } catch (error) {
      displayToast(`${error}`, ToastType.ERROR);
    }
  };

  return (
    <PublicPageWrapper strict>
      <div className="h-full bg-gray-50">
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 pb-0 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <CodeLearnerLogo className="mx-auto h-20 w-auto" />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              CodeLearner Portal
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <h2 className="text-2xl font-semibold leading-7 text-gray-900 mb-6">
                Create your account
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="role"
                    className="block w-1/4 text-sm font-medium leading-6 text-gray-900"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mt-2 block w-3/4 space-y-2 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {Object.values(UserRoleEnum).map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Reconfirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>

            <p className="mt-2 text-center text-sm text-gray-500">
              Have an account?{" "}
              <a
                href={LOGIN}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicPageWrapper>
  );
};

export default SignUp;
