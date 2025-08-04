// swift-tools-version: 6.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

var packageDependencies: [Package.Dependency] = []
var targetDependencies: [Target.Dependency] = []

#if !os(Linux)
packageDependencies.append(
    .package(url: "https://github.com/airbnb/lottie-ios.git", from: "4.4.0")
)
targetDependencies.append(
    .product(name: "Lottie", package: "lottie-ios")
)
#endif

let package = Package(
    name: "AssistantApp",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .executable(name: "AssistantApp", targets: ["AssistantApp"])
    ],
    dependencies: packageDependencies,
    targets: [
        .executableTarget(
            name: "AssistantApp",
            dependencies: targetDependencies
        )
    ]
)
